import * as firebase from 'firebase';

import { GeoFirestore } from './geofirestore';
import { GeoCallbackRegistration } from './callbackRegistration';
import { encodeGeohash, geoFirestoreGetKey, geohashQueries, validateCriteria, validateLocation, validateGeoFirestoreObject, findCoordinatesKey } from './utils';

import { GeoFirestoreObj, GeoFirestoreQueryState, GeoQueryCallbacks, LocationTracked, QueryCriteria, KeyCallback, ReadyCallback } from './interfaces';

/**
 * Creates a GeoFirestoreQuery instance.
 */
export class GeoFirestoreQuery {
  // Event callbacks
  private _callbacks: GeoQueryCallbacks = { ready: [], key_entered: [], key_exited: [], key_moved: [], key_modified: [] };
  // Variable to track when the query is cancelled
  private _cancelled = false;
  private _center: firebase.firestore.GeoPoint;
  // A Map of geohash queries which currently have an active callbacks
  private _currentGeohashesQueried: Map<string, GeoFirestoreQueryState> = new Map();
  // A Map of locations that a currently active in the queries
  // Note that not all of these are currently within this query
  private _locationsTracked: Map<string, LocationTracked> = new Map();
  private _radius: number;

  // Variables used to keep track of when to fire the 'ready' event
  private _valueEventFired = false;
  private _outstandingGeohashReadyEvents: any;

  private _geohashCleanupScheduled = false;
  private _cleanUpCurrentGeohashesQueriedInterval: any;
  private _cleanUpCurrentGeohashesQueriedTimeout: any;

  /**
   * @param _collectionRef A Firestore Collection reference where the GeoFirestore data will be stored.
   * @param queryCriteria The criteria which specifies the query's center and radius.
   */
  constructor(private _collectionRef: firebase.firestore.CollectionReference, queryCriteria: QueryCriteria) {
    // Firebase reference of the GeoFirestore which created this query
    if (Object.prototype.toString.call(this._collectionRef) !== '[object Object]') {
      throw new Error('firebaseRef must be an instance of Firestore');
    }

    // Every ten seconds, clean up the geohashes we are currently querying for. We keep these around
    // for a little while since it's likely that they will need to be re-queried shortly after they
    // move outside of the query's bounding box.
    this._cleanUpCurrentGeohashesQueriedInterval = setInterval(() => {
      if (this._geohashCleanupScheduled === false) {
        this._cleanUpCurrentGeohashesQueried();
      }
    }, 10000);

    // Validate and save the query criteria
    validateCriteria(queryCriteria, true);
    this._center = queryCriteria.center;
    this._radius = queryCriteria.radius;

    // Listen for new geohashes being added around this query and fire the appropriate events
    this._listenForNewGeohashes();
  }

  /********************/
  /*  PUBLIC METHODS  */
  /********************/
  /**
   * Terminates this query so that it no longer sends location updates. All callbacks attached to this
   * query via on() will be cancelled. This query can no longer be used in the future.
   */
  public cancel(): void {
    // Mark this query as cancelled
    this._cancelled = true;

    // Cancel all callbacks in this query's callback list
    this._callbacks = { ready: [], key_entered: [], key_exited: [], key_moved: [], key_modified: [] };

    // Turn off all Firebase listeners for the current geohashes being queried
    const keys: string[] = Array.from(this._currentGeohashesQueried.keys());
    keys.forEach((geohashQueryStr: string) => {
      this._cancelGeohashQuery(this._currentGeohashesQueried.get(geohashQueryStr));
      this._currentGeohashesQueried.delete(geohashQueryStr);
    });

    // Delete any stored locations
    this._locationsTracked = new Map();

    // Turn off the current geohashes queried clean up interval
    clearInterval(this._cleanUpCurrentGeohashesQueriedInterval);
  }

  /**
   * Returns the location signifying the center of this query.
   *
   * @returns The GeoPoint signifying the center of this query.
   */
  public center(): firebase.firestore.GeoPoint {
    return this._center;
  }

  /**
   * Attaches a callback to this query which will be run when the provided eventType fires. Valid eventType
   * values are 'ready', 'key_entered', 'key_exited', 'key_moved', and 'key_modified'. The ready event callback
   * is passed no parameters. All other callbacks will be passed three parameters: (1) the location's key, (2)
   * the location's document, and (3) the distance, in kilometers, from the location to this query's center
   *
   * 'ready' is used to signify that this query has loaded its initial state and is up-to-date with its corresponding
   * GeoFirestore instance. 'ready' fires when this query has loaded all of the initial data from GeoFirestore and fired all
   * other events for that data. It also fires every time updateCriteria() is called, after all other events have
   * fired for the updated query.
   *
   * 'key_entered' fires when a key enters this query. This can happen when a key moves from a location outside of
   * this query to one inside of it or when a key is written to GeoFirestore for the first time and it falls within
   * this query.
   *
   * 'key_exited' fires when a key moves from a location inside of this query to one outside of it. If the key was
   * entirely removed from GeoFire, both the location and distance passed to the callback will be null.
   *
   * 'key_moved' fires when a key which is already in this query moves to another location inside of it.
   * 
   * 'key_modified' fires when a key which is already in this query and the document has changed, while the location has stayed the same.
   *
   * Returns a GeoCallbackRegistration which can be used to cancel the callback. You can add as many callbacks
   * as you would like for the same eventType by repeatedly calling on(). Each one will get called when its
   * corresponding eventType fires. Each callback must be cancelled individually.
   *
   * @param eventType The event type for which to attach the callback. One of 'ready', 'key_entered',
   * 'key_exited', 'key_moved', or 'key_modified'.
   * @param callback Callback function to be called when an event of type eventType fires.
   * @returns A callback registration which can be used to cancel the provided callback.
   */
  public on(eventType: string, callback: KeyCallback | ReadyCallback): GeoCallbackRegistration {
    // Validate the inputs
    if (['ready', 'key_entered', 'key_exited', 'key_moved', 'key_modified'].indexOf(eventType) === -1) {
      throw new Error('event type must be \'ready\', \'key_entered\', \'key_exited\', \'key_moved\', or \'key_modified\'');
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function');
    }

    // Add the callback to this query's callbacks list
    this._callbacks[eventType].push(callback);

    // If this is a 'key_entered' callback, fire it for every location already within this query
    if (eventType === 'key_entered') {
      this._locationsTracked.forEach((locationMap: LocationTracked, key: string) => {
        if (typeof locationMap !== 'undefined' && locationMap.isInQuery) {
          const keyCallback: KeyCallback = callback; 
          keyCallback(key, locationMap.document, locationMap.distanceFromCenter);
        }
      });
    }

    // If this is a 'ready' callback, fire it if this query is already ready
    if (eventType === 'ready' && this._valueEventFired) {
      callback();
    }

    // Return an event registration which can be used to cancel the callback
    return new GeoCallbackRegistration(() => {
      this._callbacks[eventType].splice(this._callbacks[eventType].indexOf(callback), 1);
    });
  }

  /**
   * Returns the radius of this query, in kilometers.
   *
   * @returns The radius of this query, in kilometers.
   */
  public radius(): number {
    return this._radius;
  }

  /**
   * Updates the criteria for this query.
   *
   * @param newQueryCriteria The criteria which specifies the query's center and radius.
   */
  public updateCriteria(newQueryCriteria: QueryCriteria): void {
    // Validate and save the new query criteria
    validateCriteria(newQueryCriteria);
    this._center = newQueryCriteria.center || this._center;
    this._radius = newQueryCriteria.radius || this._radius;

    // Loop through all of the locations in the query, update their distance from the center of the query, and fire any appropriate events
    const keys: string[] = Array.from(this._locationsTracked.keys());
    for (const key of keys) {
      // If the query was cancelled while going through this loop, stop updating locations and stop firing events
      if (this._cancelled === true) {
        break;
      }
      // Get the cached information for this location
      const locationMap = this._locationsTracked.get(key);
      // Save if the location was already in the query
      const wasAlreadyInQuery = locationMap.isInQuery;
      // Update the location's distance to the new query center
      locationMap.distanceFromCenter = GeoFirestore.distance(locationMap.location, this._center);
      // Determine if the location is now in this query
      locationMap.isInQuery = (locationMap.distanceFromCenter <= this._radius);
      // If the location just left the query, fire the 'key_exited' callbacks
      // Else if the location just entered the query, fire the 'key_entered' callbacks
      if (wasAlreadyInQuery && !locationMap.isInQuery) {
        this._fireCallbacksForKey('key_exited', key, locationMap.document, locationMap.distanceFromCenter);
      } else if (!wasAlreadyInQuery && locationMap.isInQuery) {
        this._fireCallbacksForKey('key_entered', key, locationMap.document, locationMap.distanceFromCenter);
      }
    }

    // Reset the variables which control when the 'ready' event fires
    this._valueEventFired = false;

    // Listen for new geohashes being added to GeoFirestore and fire the appropriate events
    this._listenForNewGeohashes();
  }


  /*********************/
  /*  PRIVATE METHODS  */
  /*********************/
  /**
   * Turns off all callbacks for the provide geohash query.
   *
   * @param queryState An object storing the current state of the query.
   */
  private _cancelGeohashQuery(queryState: GeoFirestoreQueryState): void {
    queryState.childCallback();
    queryState.valueCallback();
  }

  /**
   * Callback for child added events.
   *
   * @param locationDataSnapshot A snapshot of the data stored for this location.
   */
  private _childAddedCallback(locationDataSnapshot: firebase.firestore.DocumentSnapshot): void {
    const data: GeoFirestoreObj = (locationDataSnapshot.exists) ? locationDataSnapshot.data() as GeoFirestoreObj : null;
    const document: any = (data && validateGeoFirestoreObject(data)) ? data.d : null;
    const location: firebase.firestore.GeoPoint = (data && validateLocation(data.l)) ? data.l : null;
    this._updateLocation(geoFirestoreGetKey(locationDataSnapshot), location, document);
  }

  /**
   * Callback for child changed events
   *
   * @param locationDataSnapshot A snapshot of the data stored for this location.
   */
  private _childChangedCallback(locationDataSnapshot: firebase.firestore.DocumentSnapshot): void {
    const data: GeoFirestoreObj = (locationDataSnapshot.exists) ? locationDataSnapshot.data() as GeoFirestoreObj : null;
    const document: any = (data && validateGeoFirestoreObject(data)) ? data.d : null;
    const location: firebase.firestore.GeoPoint = (data && validateLocation(data.l)) ? data.l : null;
    this._updateLocation(geoFirestoreGetKey(locationDataSnapshot), location, document, true);
  }

  /**
   * Callback for child removed events
   *
   * @param locationDataSnapshot A snapshot of the data stored for this location.
   */
  private _childRemovedCallback(locationDataSnapshot: firebase.firestore.DocumentSnapshot): void {
    const key: string = geoFirestoreGetKey(locationDataSnapshot);
    if (this._locationsTracked.has(key)) {
      this._collectionRef.doc(key).get().then((snapshot: firebase.firestore.DocumentSnapshot) => {
        const data: GeoFirestoreObj = (snapshot.exists) ? snapshot.data() as GeoFirestoreObj : null;
        const document: any = (data && validateGeoFirestoreObject(data)) ? data.d : null;
        const location: firebase.firestore.GeoPoint = (data && validateLocation(data.l)) ? data.l : null;
        const geohash: string = (location !== null) ? encodeGeohash(location) : null;
        // Only notify observers if key is not part of any other geohash query or this actually might not be
        // a key exited event, but a key moved or entered event. These events will be triggered by updates
        // to a different query
        if (!this._geohashInSomeQuery(geohash)) {
          this._removeLocation(key, document);
        }
      });
    }
  }

  /**
   * Removes unnecessary Firebase queries which are currently being queried.
   */
  private _cleanUpCurrentGeohashesQueried(): void {
    let keys: string[] = Array.from(this._currentGeohashesQueried.keys());
    keys.forEach((geohashQueryStr: string) => {
      const queryState: any = this._currentGeohashesQueried.get(geohashQueryStr);
      if (queryState.active === false) {
        // Delete the geohash since it should no longer be queried
        this._cancelGeohashQuery(queryState);
        this._currentGeohashesQueried.delete(geohashQueryStr);
      }
    });

    // Delete each location which should no longer be queried
    keys = Array.from(this._locationsTracked.keys());
    keys.forEach((key: string) => {
      if (!this._geohashInSomeQuery(this._locationsTracked.get(key).geohash)) {
        if (this._locationsTracked.get(key).isInQuery) {
          throw new Error('Internal State error, trying to remove location that is still in query');
        }
        this._locationsTracked.delete(key);
      }
    });

    // Specify that this is done cleaning up the current geohashes queried
    this._geohashCleanupScheduled = false;

    // Cancel any outstanding scheduled cleanup
    if (this._cleanUpCurrentGeohashesQueriedTimeout !== null) {
      clearTimeout(this._cleanUpCurrentGeohashesQueriedTimeout);
      this._cleanUpCurrentGeohashesQueriedTimeout = null;
    }
  }

  /**
   * Fires each callback for the provided eventType, passing it provided key's data.
   *
   * @param eventType The event type whose callbacks to fire. One of 'key_entered', 'key_exited', 'key_moved', or 'key_modified'.
   * @param key The key of the location for which to fire the callbacks.
   * @param document The document from the GeoFirestore Collection.
   * @param distanceFromCenter The distance from the center or null.
   */
  private _fireCallbacksForKey(eventType: string, key: string, document?: any, distanceFromCenter?: number): void {
    this._callbacks[eventType].forEach((callback) => {
      if (typeof document === 'undefined' || document === null) {
        callback(key, null, null);
      } else {
        callback(key, document, distanceFromCenter);
      }
    });
  }

  /**
   * Fires each callback for the 'ready' event.
   */
  private _fireReadyEventCallbacks(): void {
    this._callbacks.ready.forEach((callback) => {
      callback();
    });
  }

  /**
   * Checks if this geohash is currently part of any of the geohash queries.
   *
   * @param geohash The geohash.
   * @returns Returns true if the geohash is part of any of the current geohash queries.
   */
  private _geohashInSomeQuery(geohash: string): boolean {
    const keys: string[] = Array.from(this._currentGeohashesQueried.keys());
    for (const queryStr of keys) {
      if (this._currentGeohashesQueried.has(queryStr)) {
        const query = this._stringToQuery(queryStr);
        if (geohash >= query[0] && geohash <= query[1]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Called once all geohash queries have received all child added events and fires the ready
   * event if necessary.
   */
  private _geohashQueryReadyCallback(queryStr?: string): void {
    const index: number = this._outstandingGeohashReadyEvents.indexOf(queryStr);
    if (index > -1) {
      this._outstandingGeohashReadyEvents.splice(index, 1);
    }
    this._valueEventFired = (this._outstandingGeohashReadyEvents.length === 0);

    // If all queries have been processed, fire the ready event
    if (this._valueEventFired) {
      this._fireReadyEventCallbacks();
    }
  }

  /**
   * Attaches listeners to Firebase which track when new geohashes are added within this query's
   * bounding box.
   */
  private _listenForNewGeohashes(): void {
    // Get the list of geohashes to query
    let geohashesToQuery: string[] = geohashQueries(this._center, this._radius * 1000).map(this._queryToString);

    // Filter out duplicate geohashes
    geohashesToQuery = geohashesToQuery.filter((geohash: string, i: number) => geohashesToQuery.indexOf(geohash) === i);

    // For all of the geohashes that we are already currently querying, check if they are still
    // supposed to be queried. If so, don't re-query them. Otherwise, mark them to be un-queried
    // next time we clean up the current geohashes queried map.
    this._currentGeohashesQueried.forEach((value: GeoFirestoreQueryState, key: string) => {
      const index: number = geohashesToQuery.indexOf(key);
      if (index === -1) {
        value.active = false;
      } else {
        value.active = true;
        geohashesToQuery.splice(index, 1);
      }
    });

    // If we are not already cleaning up the current geohashes queried and we have more than 25 of them,
    // kick off a timeout to clean them up so we don't create an infinite number of unneeded queries.
    if (this._geohashCleanupScheduled === false && this._currentGeohashesQueried.size > 25) {
      this._geohashCleanupScheduled = true;
      this._cleanUpCurrentGeohashesQueriedTimeout = setTimeout(this._cleanUpCurrentGeohashesQueried, 10);
    }

    // Keep track of which geohashes have been processed so we know when to fire the 'ready' event
    this._outstandingGeohashReadyEvents = geohashesToQuery.slice();

    // Loop through each geohash to query for and listen for new geohashes which have the same prefix.
    // For every match, attach a value callback which will fire the appropriate events.
    // Once every geohash to query is processed, fire the 'ready' event.
    geohashesToQuery.forEach((toQueryStr: string) => {
      // decode the geohash query string
      const query: string[] = this._stringToQuery(toQueryStr);

      // Create the Firebase query
      const firestoreQuery: firebase.firestore.Query = this._collectionRef.orderBy('g').startAt(query[0]).endAt(query[1]);

      // For every new matching geohash, determine if we should fire the 'key_entered' event
      const childCallback = firestoreQuery.onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot.docChanges.forEach((change: firebase.firestore.DocumentChange) => {
          if (change.type === 'added') {
            this._childAddedCallback(change.doc);
          }
          if (change.type === 'modified') {
            this._childChangedCallback(change.doc);
          }
          if (change.type === 'removed') {
            this._childRemovedCallback(change.doc);
          }
        });
      });

      // Once the current geohash to query is processed, see if it is the last one to be processed
      // and, if so, mark the value event as fired.
      // Note that Firebase fires the 'value' event after every 'added' event fires.
      const valueCallback = firestoreQuery.onSnapshot(() => {
        valueCallback();
        this._geohashQueryReadyCallback(toQueryStr);
      });

      // Add the geohash query to the current geohashes queried map and save its state
      this._currentGeohashesQueried.set(toQueryStr, {
        active: true,
        childCallback,
        valueCallback
      });
    });
    // Based upon the algorithm to calculate geohashes, it's possible that no 'new'
    // geohashes were queried even if the client updates the radius of the query.
    // This results in no 'READY' event being fired after the .updateCriteria() call.
    // Check to see if this is the case, and trigger the 'READY' event.
    if (geohashesToQuery.length === 0) {
      this._geohashQueryReadyCallback();
    }
  }

  /**
   * Encodes a query as a string for easier indexing and equality.
   *
   * @param query The query to encode.
   * @returns The encoded query as string.
   */
  private _queryToString(query: string[]): string {
    if (query.length !== 2) {
      throw new Error('Not a valid geohash query: ' + query);
    }
    return query[0] + ':' + query[1];
  }

  /**
   * Removes the document/location from the local state and fires any events if necessary.
   *
   * @param key The key to be removed.
   * @param document The current Document from Firestore, or null if removed.
   */
  private _removeLocation(key: string, document?: any): void {
    const locationMap = this._locationsTracked.get(key);
    this._locationsTracked.delete(key);
    if (typeof locationMap !== 'undefined' && locationMap.isInQuery) {
      const locationKey = (document) ? findCoordinatesKey(document) : null;
      const location: firebase.firestore.GeoPoint = (locationKey) ? document[locationKey] :  null;
      const distanceFromCenter: number = (location) ? GeoFirestore.distance(location, this._center) : null;
      this._fireCallbacksForKey('key_exited', key, document, distanceFromCenter);
    }
  }

  /**
   * Decodes a query string to a query
   *
   * @param str The encoded query.
   * @returns The decoded query as a [start, end] pair.
   */
  private _stringToQuery(str: string): string[] {
    const decoded: string[] = str.split(':');
    if (decoded.length !== 2) {
      throw new Error('Invalid internal state! Not a valid geohash query: ' + str);
    }
    return decoded;
  }

  /**
   * Callback for any updates to locations. Will update the information about a key and fire any necessary
   * events every time the key's location changes.
   *
   * When a key is removed from GeoFirestore or the query, this function will be called with null and performs
   * any necessary cleanup.
   *
   * @param key The key of the GeoFirestore location.
   * @param location The location as a Firestore GeoPoint.
   * @param document The current Document from Firestore.
   * @param modified Flag for if document is a modified document/
   */
  private _updateLocation(key: string, location?: firebase.firestore.GeoPoint, document?: any, modified = false): void {
    validateLocation(location);
    // Get the key and location
    let distanceFromCenter: number, isInQuery;
    const wasInQuery: boolean = (this._locationsTracked.has(key)) ? this._locationsTracked.get(key).isInQuery : false;
    const oldLocation: firebase.firestore.GeoPoint = (this._locationsTracked.has(key)) ? this._locationsTracked.get(key).location : null;

    // Determine if the location is within this query
    distanceFromCenter = GeoFirestore.distance(location, this._center);
    isInQuery = (distanceFromCenter <= this._radius);

    // Add this location to the locations queried map even if it is not within this query
    this._locationsTracked.set(key, {
      distanceFromCenter,
      document,
      geohash: encodeGeohash(location),
      isInQuery,
      location
    });

    // Fire the 'key_entered' event if the provided key has entered this query
    if (isInQuery && !wasInQuery) {
      this._fireCallbacksForKey('key_entered', key, document, distanceFromCenter);
    } else if (isInQuery && oldLocation !== null && (location.latitude !== oldLocation.latitude || location.longitude !== oldLocation.longitude)) {
      this._fireCallbacksForKey('key_moved', key, document, distanceFromCenter);
    } else if (!isInQuery && wasInQuery) {
      this._fireCallbacksForKey('key_exited', key, document, distanceFromCenter);
    } else if (isInQuery && modified) {
      this._fireCallbacksForKey('key_modified', key, document, distanceFromCenter);
    }
  }
}

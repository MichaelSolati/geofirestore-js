import { GeoFirestoreQuery } from './query';
import { decodeGeoFirestoreObject, degreesToRadians, encodeGeoFireObject, encodeGeohash, validateLocation, validateKey, findCoordinatesKey } from './utils';

import { firestore, GeoFirestoreObj, QueryCriteria } from './interfaces';

/**
 * Creates a GeoFirestore instance.
 */
export class GeoFirestore {
  private _isWeb: boolean;
  /**
   * @param collectionRef A Firestore Collection reference where the GeoFirestore data will be stored.
   */
  constructor(private _collectionRef: firestore.web.CollectionReference | firestore.cloud.CollectionReference) {
    if (Object.prototype.toString.call(this._collectionRef) !== '[object Object]') {
      throw new Error('collectionRef must be an instance of a Firestore Collection');
    }

    this._isWeb = Object.prototype.toString.call((this._collectionRef as firestore.web.CollectionReference).firestore.enablePersistence) === '[object Function]';
  }

  /********************/
  /*  PUBLIC METHODS  */
  /********************/
  /**
   * Adds document to Firestore. Returns a promise which is fulfilled when the write is complete.
   *
   * @param document The document to be added to the GeoFirestore.
   * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
   * @returns A promise that is fulfilled when the write is complete.
   */
  public add(document: any, customKey?: string): Promise<firestore.web.DocumentReference | firestore.cloud.DocumentReference> {
    if (Object.prototype.toString.call(document) === '[object Object]') {
      const locationKey: string = findCoordinatesKey(document, customKey);
      const location: firestore.web.GeoPoint | firestore.cloud.GeoPoint = document[locationKey];
      const geohash: string = encodeGeohash(location);
      return this._collectionRef.add(encodeGeoFireObject(location, geohash, document));
    } else {
      throw new Error('document must be an object');
    }
  }

  /**
   * Returns a promise fulfilled with the document corresponding to the provided key.
   *
   * If the provided key does not exist, the returned promise is fulfilled with null.
   *
   * @param $key The key of the location to retrieve.
   * @param options Describes whether we should get from server or cache.
   * @returns A promise that is fulfilled with the document of the given key.
   */
  public get($key: string, options: firestore.web.GetOptions = { source: 'default' }): Promise<any> {
    validateKey($key);
    const documentReference: firestore.web.DocumentReference = this._collectionRef.doc($key) as firestore.web.DocumentReference;
    const promise: Promise<firestore.web.DocumentSnapshot> = this._isWeb ? documentReference.get(options) : documentReference.get();

    return promise.then((documentSnapshot: firestore.web.DocumentSnapshot) => {
      if (!documentSnapshot.exists) {
        return null;
      } else {
        const snapshotVal: GeoFirestoreObj = documentSnapshot.data() as GeoFirestoreObj;
        return decodeGeoFirestoreObject(snapshotVal);
      }
    });
  }

  /**
   * Returns the Firestore Collection used to create this GeoFirestore instance.
   *
   * @returns The Firestore Collection used to create this GeoFirestore instance.
   */
  public ref(): firestore.web.CollectionReference | firestore.cloud.CollectionReference {
    return this._collectionRef;
  }

  /**
   * Removes the provided key, or keys, from this GeoFirestore. Returns an empty promise fulfilled when the key(s) has been removed.
   *
   * If the provided key(s) is not in this GeoFirestore, the promise will still successfully resolve.
   *
   * @param keyOrKeys The key representing the document to remove or an array of keys to remove.
   * @returns A promise that is fulfilled after the inputted key(s) is removed.
   */
  public remove(keyOrKeys: string | string[]): Promise<any> {
    if (Array.isArray(keyOrKeys)) {
      const documents = {};
      keyOrKeys.forEach(key => { documents[key] = null; });
      return this.set(documents);
    } else {
      return this.set(keyOrKeys);
    }
  }

  /**
   * Adds the provided key - location pair(s) to Firestore. Returns an empty promise which is fulfilled when the write is complete.
   *
   * If any provided key already exists in this GeoFirestore, it will be overwritten with the new location value.
   *
   * @param keyOrDocuments The key representing the document to add or an object of $key - document pairs.
   * @param document The document to be added to the GeoFirestore.
   * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
   * @returns A promise that is fulfilled when the write is complete.
   */
  public set(keyOrDocuments: string | any, document?: any, customKey?: string): Promise<any> {
    if (typeof keyOrDocuments === 'string' && keyOrDocuments.length !== 0) {
      validateKey(keyOrDocuments);
      if (!document) {
        // Setting location to null is valid since it will remove the key
        return this._collectionRef.doc(keyOrDocuments).delete();
      } else {
        const locationKey: string = findCoordinatesKey(document, customKey);
        const location: firestore.web.GeoPoint | firestore.cloud.GeoPoint = document[locationKey];
        const geohash: string = encodeGeohash(location);
        return this._collectionRef.doc(keyOrDocuments).set(encodeGeoFireObject(location, geohash, document));
      }
    } else if (typeof keyOrDocuments === 'object') {
      if (typeof document !== 'undefined') {
        throw new Error('The location argument should not be used if you pass an object to set().');
      }
    } else {
      throw new Error('keyOrDocuments must be a string or a mapping of key - document pairs.');
    }

    const batch: firestore.web.WriteBatch = this._collectionRef.firestore.batch() as firestore.web.WriteBatch;
    Object.keys(keyOrDocuments).forEach((key) => {
      validateKey(key);
      const ref: firestore.web.DocumentReference = this._collectionRef.doc(key) as firestore.web.DocumentReference;
      const documentToUpdate: any = keyOrDocuments[key];
      if (!documentToUpdate) {
        batch.delete(ref);
      } else {
        const locationKey = findCoordinatesKey(documentToUpdate, customKey);
        const location: firestore.web.GeoPoint | firestore.cloud.GeoPoint = documentToUpdate[locationKey];
        const geohash: string = encodeGeohash(location);
        batch.set(ref, encodeGeoFireObject(location, geohash, documentToUpdate), { merge: true });
      }
    });
    return batch.commit();
  }

  /**
   * Returns a new GeoQuery instance with the provided queryCriteria.
   *
   * @param queryCriteria The criteria which specifies the GeoQuery's center and radius.
   * @return A new GeoFirestoreQuery object.
   */
  public query(queryCriteria: QueryCriteria): GeoFirestoreQuery {
    return new GeoFirestoreQuery(this._collectionRef, queryCriteria);
  }

  /********************/
  /*  STATIC METHODS  */
  /********************/
  /**
   * Static method which calculates the distance, in kilometers, between two locations,
   * via the Haversine formula. Note that this is approximate due to the fact that the
   * Earth's radius varies between 6356.752 km and 6378.137 km.
   *
   * @param location1 The GeoPoint of the first location.
   * @param location2 The GeoPoint of the second location.
   * @returns The distance, in kilometers, between the inputted locations.
   */
  public static distance(location1: firestore.web.GeoPoint | firestore.cloud.GeoPoint, location2: firestore.web.GeoPoint | firestore.cloud.GeoPoint): number {
    validateLocation(location1);
    validateLocation(location2);

    const radius = 6371; // Earth's radius in kilometers
    const latDelta = degreesToRadians(location2.latitude - location1.latitude);
    const lonDelta = degreesToRadians(location2.longitude - location1.longitude);

    const a = (Math.sin(latDelta / 2) * Math.sin(latDelta / 2)) +
      (Math.cos(degreesToRadians(location1.latitude)) * Math.cos(degreesToRadians(location2.latitude)) *
        Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return radius * c;
  }
}

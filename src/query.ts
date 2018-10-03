import { GeoFirestoreTypes } from './interfaces';
import { GeoQuerySnapshot } from './querySnapshot';
import { validateQueryCriteria, geohashQueries } from './utils';

/**
 * A `GeoQuery` refers to a Query which you can read or listen to. You can also
 * construct refined `GeoQuery` objects by adding filters and ordering.
 */
export class GeoQuery {
  private _center: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint;
  private _radius: number;
  private _isWeb: boolean;

  constructor(private _query: GeoFirestoreTypes.cloud.Query | GeoFirestoreTypes.web.Query, geoQueryCriteria?: GeoFirestoreTypes.QueryCriteria) {
    if (Object.prototype.toString.call(_query) !== '[object Object]') {
      throw new Error('Query must be an instance of a Firestore Query');
    }
    this._isWeb = Object.prototype.toString.call((_query as GeoFirestoreTypes.web.CollectionReference).firestore.enablePersistence) === '[object Function]';
    if (geoQueryCriteria) {
      // Validate and save the query criteria
      validateQueryCriteria(geoQueryCriteria);
      this._center = geoQueryCriteria.center;
      this._radius = geoQueryCriteria.radius;
    }
  }

  /**
   * Returns the location signifying the center of this query.
   *
   * @return The GeoPoint signifying the center of this query.
   */
  get center(): GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint {
    return this._center;
  }

  get geoQueryCriteria(): GeoFirestoreTypes.QueryCriteria {
    return {
      center: this._center,
      radius: this._radius
    };
  }

  get firestore(): GeoFirestoreTypes.cloud.Firestore | GeoFirestoreTypes.web.Firestore {
    return this._query.firestore;
  }

  /**
   * Gets a `Query`, which you can read or listen to, used by the GeoQuery.
   * Using this object for queries and other commands WILL NOT take
   * advantage of GeoFirestore's geo based logic.
   *
   * @return The `Query` instance.
   */
  get query(): GeoFirestoreTypes.cloud.Query | GeoFirestoreTypes.web.Query {
    return this._query;
  }

  /**
   * Returns the radius of this query, in kilometers.
   *
   * @return The radius of this query, in kilometers.
   */
  get radius(): number {
    return this._radius;
  }

  /**
   * Executes the query and returns the results as a GeoQuerySnapshot.
   *
   * WEB CLIENT ONLY
   * Note: By default, get() attempts to provide up-to-date data when possible
   * by waiting for data from the server, but it may return cached data or fail
   * if you are offline and the server cannot be reached. This behavior can be
   * altered via the `GetOptions` parameter.
   *
   * @param options An object to configure the get behavior.
   * @return A Promise that will be resolved with the results of the GeoQuery.
   */
  public get(options: GeoFirestoreTypes.web.GetOptions = { source: 'default' }): Promise<GeoQuerySnapshot> {
    if (this._center && this._radius) {
      const queries = this._generateQuery().map((query) => this._isWeb ? query.get(options) : query.get());
      return Promise.all(queries).then(value => new GeoQuerySnapshot(this._joinQueries(value), this.geoQueryCriteria));
    } else {
      const promise = this._isWeb ? (this._query as GeoFirestoreTypes.web.Query).get(options) : (this._query as GeoFirestoreTypes.web.Query).get();
      return promise.then((snapshot) => new GeoQuerySnapshot(snapshot));
    }
  }

  /**
   * Attaches a listener for `GeoQuerySnapshot` events.
   *
   * @param onNext A callback to be called every time a new `GeoQuerySnapshot` is available.
   * @param onError A callback to be called if the listen fails or is cancelled. Since multuple queries occur only the failed query will cease.
   * @return An unsubscribe function that can be called to cancel the snapshot listener.
   */
  public onSnapshot(onNext: (snapshot: GeoQuerySnapshot) => void, onError?: (error: Error) => void): () => void {
    if (this._center && this._radius) {
      const subscriptions: Array<() => void> = [];
      this._generateQuery().forEach((value: GeoFirestoreTypes.web.Query) => {
        const subscription = value.onSnapshot((snapshot) => {
          onNext(new GeoQuerySnapshot(snapshot, this.geoQueryCriteria));
        }, (error) => {
          if (onError) {
            onError(error);
          }
        });
        subscriptions.push(subscription);
      });
      return () => subscriptions.forEach(subscription => subscription());
    } else {
      return (this._query as GeoFirestoreTypes.web.Query).onSnapshot((snapshot) => onNext(new GeoQuerySnapshot(snapshot)), onError);
    }
  }

  /**
   * Updates the criteria for this query.
   *
   * @param newQueryCriteria The criteria which specifies the query's center and radius.
   */
  public updateCriteria(newGeoQueryCriteria: GeoFirestoreTypes.QueryCriteria): void {
    // Validate and save the new query criteria
    validateQueryCriteria(newGeoQueryCriteria);
    this._center = newGeoQueryCriteria.center || this._center;
    this._radius = newGeoQueryCriteria.radius || this._radius;
  }

  /**
   * Creates and returns a new GeoQuery with the additional filter that documents
   * must contain the specified field and that its value should satisfy the
   * relation constraint provided.
   *
   * This function returns a new (immutable) instance of the GeoQuery (rather
   * than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created GeoQuery.
   */
  public where(
    fieldPath: string | GeoFirestoreTypes.cloud.FieldPath | GeoFirestoreTypes.web.FieldPath,
    opStr: GeoFirestoreTypes.cloud.WhereFilterOp | GeoFirestoreTypes.web.WhereFilterOp,
    value: any
  ): GeoQuery {
    return new GeoQuery(this._query.where(fieldPath, opStr, value), this.geoQueryCriteria);
  }

  private _generateQuery(): GeoFirestoreTypes.web.Query[] {
    // Get the list of geohashes to query
    let geohashesToQuery: string[] = geohashQueries(this._center, this._radius * 1000).map(this._queryToString);
    // Filter out duplicate geohashes
    geohashesToQuery = geohashesToQuery.filter((geohash: string, i: number) => geohashesToQuery.indexOf(geohash) === i);

    return geohashesToQuery.map((toQueryStr: string) => {
      // decode the geohash query string
      const query: string[] = this._stringToQuery(toQueryStr);
      // Create the Firebase query
      return this._query.orderBy('g').startAt(query[0]).endAt(query[1]) as GeoFirestoreTypes.web.Query;
    });
  }

  private _joinQueries(results: GeoFirestoreTypes.web.QuerySnapshot[]): GeoFirestoreTypes.web.QuerySnapshot {
    const docs = [];
    let size = 0;
    const docChanges = [];

    results.forEach((value: GeoFirestoreTypes.web.QuerySnapshot) => {
      docs.concat(value.docs);
      size += value.size;
      docChanges.concat(value.docChanges());
    });

    return {
      docs,
      size,
      empty: Boolean(size),
      docChanges: () => docChanges
    } as GeoFirestoreTypes.web.QuerySnapshot;
  }

  /**
   * Decodes a query string to a query
   *
   * @param str The encoded query.
   * @return The decoded query as a [start, end] pair.
   */
  private _stringToQuery(str: string): string[] {
    const decoded: string[] = str.split(':');
    if (decoded.length !== 2) {
      throw new Error('Invalid internal state! Not a valid geohash query: ' + str);
    }
    return decoded;
  }

  /**
   * Encodes a query as a string for easier indexing and equality.
   *
   * @param query The query to encode.
   * @return The encoded query as string.
   */
  private _queryToString(query: string[]): string {
    if (query.length !== 2) {
      throw new Error('Not a valid geohash query: ' + query);
    }
    return query[0] + ':' + query[1];
  }
}
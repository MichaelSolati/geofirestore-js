import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoFirestore } from './GeoFirestore';
import { GeoQuerySnapshot } from './GeoQuerySnapshot';
import { GeoJoinerOnSnapshot } from './GeoJoinerOnSnapshot';
import { validateQueryCriteria, geohashQueries } from './utils';

/**
 * A `GeoQuery` refers to a Query which you can read or listen to. You can also construct refined `GeoQuery` objects by adding filters and
 * ordering.
 */
export class GeoQuery {
  private _center: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint;
  private _radius: number;
  private _isWeb: boolean;

  /**
   * @param _query The `Query` instance.
   * @param near The center and radius of geo based queries.
   */
  constructor(
    private _query: GeoFirestoreTypes.cloud.Query | GeoFirestoreTypes.web.Query,
    near?: GeoFirestoreTypes.QueryCriteria
  ) {
    if (Object.prototype.toString.call(_query) !== '[object Object]') {
      throw new Error('Query must be an instance of a Firestore Query');
    }
    this._isWeb = Object.prototype.toString
      .call((_query as GeoFirestoreTypes.web.CollectionReference).firestore.enablePersistence) === '[object Function]';
    if (near) {
      // Validate and save the query criteria
      validateQueryCriteria(near);
      this._center = near.center;
      this._radius = near.radius;
    }
  }

  /**
   * The `Firestore` for the Firestore database (useful for performing transactions, etc.).
   */
  get firestore(): GeoFirestore {
    return new GeoFirestore(this._query.firestore);
  }

  /**
   * Attaches a listener for `GeoQuerySnapshot` events.
   *
   * @param onNext A callback to be called every time a new `GeoQuerySnapshot` is available.
   * @param onError A callback to be called if the listen fails or is cancelled. Since multuple queries occur only the failed query will
   * cease.
   * @return An unsubscribe function that can be called to cancel the snapshot listener.
   */
  get onSnapshot(): (onNext: (snapshot: GeoQuerySnapshot) => void, onError?: (error: Error) => void) => void {
    return (onNext: (snapshot: GeoQuerySnapshot) => void, onError?: (error: Error) => void) => {
      if (this._center && this._radius) {
        return new GeoJoinerOnSnapshot(this._generateQuery(), this._near, onNext, onError).unsubscribe();
      } else {
        return (this._query as GeoFirestoreTypes.web.Query).onSnapshot((snapshot) => onNext(new GeoQuerySnapshot(snapshot)), onError);
      }
    };
  }

  /**
   * Executes the query and returns the results as a GeoQuerySnapshot.
   *
   * WEB CLIENT ONLY
   * Note: By default, get() attempts to provide up-to-date data when possible by waiting for data from the server, but it may return
   * cached data or fail if you are offline and the server cannot be reached. This behavior can be altered via the `GetOptions` parameter.
   *
   * @param options An object to configure the get behavior.
   * @return A Promise that will be resolved with the results of the GeoQuery.
   */
  public get(options: GeoFirestoreTypes.web.GetOptions = { source: 'default' }): Promise<GeoQuerySnapshot> {
    if (this._center && this._radius) {
      const queries = this._generateQuery().map((query) => this._isWeb ? query.get(options) : query.get());
      return Promise.all(queries).then(value => new GeoQuerySnapshot(this._joinQueries(value), this._near.center));
    } else {
      const promise = this._isWeb ?
        (this._query as GeoFirestoreTypes.web.Query).get(options) : (this._query as GeoFirestoreTypes.web.Query).get();
      return promise.then((snapshot) => new GeoQuerySnapshot(snapshot));
    }
  }

  /**
   * Creates and returns a new GeoQuery with the geoquery filter where `get` and `onSnapshot` will query around.
   *
   * This function returns a new (immutable) instance of the GeoQuery (rather than modify the existing instance) to impose the filter.
   *
   * @param newQueryCriteria The criteria which specifies the query's center and radius.
   * @return The created GeoQuery.
   */
  public near(newGeoQueryCriteria: GeoFirestoreTypes.QueryCriteria): GeoQuery {
    // Validate and save the new query criteria
    validateQueryCriteria(newGeoQueryCriteria);
    this._center = newGeoQueryCriteria.center || this._center;
    this._radius = newGeoQueryCriteria.radius || this._radius;

    return new GeoQuery(this._query, this._near);
  }

  /**
   * Creates and returns a new GeoQuery with the additional filter that documents must contain the specified field and that its value
   * should satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the GeoQuery (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created GeoQuery.
   */
  public where(
    fieldPath: string | GeoFirestoreTypes.cloud.FieldPath | GeoFirestoreTypes.web.FieldPath,
    opStr: GeoFirestoreTypes.WhereFilterOp,
    value: any
  ): GeoQuery {
    return new GeoQuery(this._query.where(fieldPath, opStr, value), this._near);
  }

  /**
   * Creates an array of `Query` objects that query the appropriate geohashes based on the radius and center GeoPoint of the query criteria.
   *
   * @return Array of Queries to search against.
   */
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

  /**
   * Returns the center and radius of geo based queries as a QueryCriteria object.
   */
  private get _near(): GeoFirestoreTypes.QueryCriteria {
    return {
      center: this._center,
      radius: this._radius
    };
  }

  /**
   * Merges the results of an array of QuerySnapshots into one QuerySnapshot (like) object.
   *
   * @param results An array of QuerySnapshots from multiple queries.
   * @return A single QuerySnapshot from an array of QuerySnapshots.
   */
  private _joinQueries(results: GeoFirestoreTypes.web.QuerySnapshot[]): GeoFirestoreTypes.web.QuerySnapshot {
    let docs = [];
    let docChanges = [];

    results.forEach((value: GeoFirestoreTypes.web.QuerySnapshot) => {
      docs = docs.concat(value.docs);
      docChanges = docChanges.concat(value.docChanges());
    });

    return {
      docs,
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
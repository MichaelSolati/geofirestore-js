import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoFirestore } from './GeoFirestore';
import { GeoJoinerGet } from './GeoJoinerGet';
import { GeoJoinerOnSnapshot } from './GeoJoinerOnSnapshot';
import { GeoQuerySnapshot } from './GeoQuerySnapshot';
import { validateQueryCriteria, geohashQueries, validateLimit } from './utils';

/**
 * A `GeoQuery` refers to a Query which you can read or listen to. You can also construct refined `GeoQuery` objects by adding filters and
 * ordering.
 */
export class GeoQuery {
  private _center: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint;
  private _limit: number;
  private _radius: number;
  private _isWeb: boolean;
  private _ineq = false;

  /**
   * @param _query The `Query` instance.
   * @param queryCriteria The query criteria of geo based queries, includes field such as center, radius, and limit.
   */
  constructor(
    private _query: GeoFirestoreTypes.cloud.Query | GeoFirestoreTypes.web.Query,
    queryCriteria?: GeoFirestoreTypes.QueryCriteria
  ) {
    if (Object.prototype.toString.call(_query) !== '[object Object]') {
      throw new Error('Query must be an instance of a Firestore Query');
    }
    this._isWeb = Object.prototype.toString
      .call((_query as GeoFirestoreTypes.web.CollectionReference).firestore.enablePersistence) === '[object Function]';
    if (queryCriteria) {
      if (queryCriteria.limit) {
        this._limit = queryCriteria.limit;
      }
      if (queryCriteria.center && queryCriteria.radius) {
        // Validate and save the query criteria
        validateQueryCriteria(queryCriteria);
        this._center = queryCriteria.center;
        this._radius = queryCriteria.radius;
      }
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
  get onSnapshot(): ((onNext: (snapshot: GeoQuerySnapshot) => void, onError?: (error: Error) => void) => () => void) {
    return (onNext: (snapshot: GeoQuerySnapshot) => void, onError?: (error: Error) => void): (() => void) => {
      if (this._center && this._radius) {
        return new GeoJoinerOnSnapshot(this._generateQuery(), this._queryCriteria, onNext, onError).unsubscribe();
      } else {
        const query = this._limit ? this._query.limit(this._limit) : this._query;
        return (query as GeoFirestoreTypes.web.Query).onSnapshot((snapshot) => onNext(new GeoQuerySnapshot(snapshot)), onError);
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
      return Promise.all(queries).then(value => new GeoJoinerGet(value, this._queryCriteria).getGeoQuerySnapshot());
    } else {
      const query = this._limit ? this._query.limit(this._limit) : this._query;
      const promise = this._isWeb ? (query as GeoFirestoreTypes.web.Query).get(options) : (query as GeoFirestoreTypes.web.Query).get();
      return promise.then((snapshot) => new GeoQuerySnapshot(snapshot));
    }
  }

  /**
   * Creates and returns a new GeoQuery that's additionally limited to only return up to the specified number of documents.
   *
   * This function returns a new (immutable) instance of the GeoQuery (rather than modify the existing instance) to impose the limit.
   *
   * Note: Limits on geoqueries are applied based on the distance from the center. Geoqueries require an aggregation of queries.
   * When performing a geoquery the library applies the limit on the client. This may mean you are loading to the client more documents
   * then you intended. Use with this performance limitation in mind.
   *
   * @param limit The maximum number of items to return.
   * @return The created GeoQuery.
   */
  public limit(limit: number): GeoQuery {
    validateLimit(limit);
    this._limit = limit;
    return new GeoQuery(this._query, this._queryCriteria);
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

    return new GeoQuery(this._query, this._queryCriteria);
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
    // True if inequality filter is used
    this._ineq = (opStr !== '==' && opStr !== 'array-contains') ? true : this._ineq;
    // Return GeoQuery
    return new GeoQuery(this._query.where((fieldPath ? ('d.' + fieldPath) : fieldPath), opStr, value), this._queryCriteria);
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
      if(!this._ineq){
        return this._query.where('g', '>=', query[0]).where('g', '<=', query[1]) as GeoFirestoreTypes.web.Query;
      }
      return this._query.orderBy('g').startAt(query[0]).endAt(query[1]) as GeoFirestoreTypes.web.Query;
    });
  }

  /**
   * Returns the center and radius of geo based queries as a QueryCriteria object.
   */
  private get _queryCriteria(): GeoFirestoreTypes.QueryCriteria {
    return {
      center: this._center,
      limit: this._limit,
      radius: this._radius
    };
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
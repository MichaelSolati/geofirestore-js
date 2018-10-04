import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoDocumentSnapshot } from './GeoDocumentSnapshot';
import { GeoFirestore } from './GeoFirestore';
import { GeoQuerySnapshot } from './GeoQuerySnapshot';
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
   * @param geoQueryCriteria The center and radius of geo based queries.
   */
  constructor(
    private _query: GeoFirestoreTypes.cloud.Query | GeoFirestoreTypes.web.Query,
    geoQueryCriteria?: GeoFirestoreTypes.QueryCriteria
  ) {
    if (Object.prototype.toString.call(_query) !== '[object Object]') {
      throw new Error('Query must be an instance of a Firestore Query');
    }
    this._isWeb = Object.prototype.toString
      .call((_query as GeoFirestoreTypes.web.CollectionReference).firestore.enablePersistence) === '[object Function]';
    if (geoQueryCriteria) {
      // Validate and save the query criteria
      validateQueryCriteria(geoQueryCriteria);
      this._center = geoQueryCriteria.center;
      this._radius = geoQueryCriteria.radius;
    }
  }

  /**
   * Returns the location signifying the center of this query.
   */
  get center(): GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint {
    return this._center;
  }

  /**
   * The `Firestore` for the Firestore database (useful for performing transactions, etc.).
   */
  get firestore(): GeoFirestore {
    return new GeoFirestore(this._query.firestore);
  }

  /**
   * Returns the center and radius of geo based queries as a QueryCriteria object.
   */
  get geoQueryCriteria(): GeoFirestoreTypes.QueryCriteria {
    return {
      center: this._center,
      radius: this._radius
    };
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
        const subscriptions: Array<() => void> = [];
        this._generateQuery().forEach((value: GeoFirestoreTypes.web.Query) => {
          const subscription = value.onSnapshot((snapshot) => {
            if (onNext) { onNext(new GeoQuerySnapshot(snapshot, this.geoQueryCriteria)); }
          }, (error) => {
            if (onError) { onError(error); }
          });
          subscriptions.push(subscription);
        });
        return () => subscriptions.forEach(subscription => subscription());
      } else {
        return (this._query as GeoFirestoreTypes.web.Query).onSnapshot((snapshot) => onNext(new GeoQuerySnapshot(snapshot)), onError);
      }
    };
  }

  /**
   * Returns the radius of this query, in kilometers.
   */
  get radius(): number {
    return this._radius;
  }

  /**
   * Creates and returns a new GeoQuery that ends at the provided document (inclusive). The end position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy of this query.
   *
   * @param snapshot The snapshot of the document to end at.
   * @return The created GeoQuery.
   */
  public endAt(snapshot: GeoDocumentSnapshot | GeoFirestoreTypes.cloud.DocumentSnapshot | GeoFirestoreTypes.web.DocumentSnapshot): GeoQuery;

  /**
   * Creates and returns a new GeoQuery that ends at the provided fields relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to end this query at, in order of the query's order by.
   * @return The created GeoQuery.
   */
  public endAt(...fieldValues: any[]): GeoQuery;

  public endAt(): GeoQuery {
    if (arguments.length === 1 && arguments[0] instanceof GeoDocumentSnapshot) {
      return new GeoQuery(this._query.endAt(arguments[0]['_snapshot']), this.geoQueryCriteria);
    }
    return new GeoQuery(this._query.endAt(...Array.from(arguments)), this.geoQueryCriteria);
  }

  /**
   * Creates and returns a new GeoQuery that ends before the provided document (exclusive). The end position is relative to the order of
   * the query. The document must contain all of the fields provided in the orderBy of this query.
   *
   * @param snapshot The snapshot of the document to end before.
   * @return The created GeoQuery.
   */
  public endBefore(
    snapshot: GeoDocumentSnapshot | GeoFirestoreTypes.cloud.DocumentSnapshot | GeoFirestoreTypes.web.DocumentSnapshot
  ): GeoQuery;

  /**
   * Creates and returns a new GeoQuery that ends before the provided fields relative to the order of the query. The order of the field
   * values must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to end this query before, in order of the query's order by.
   * @return The created GeoQuery.
   */
  public endBefore(...fieldValues: any[]): GeoQuery;

  public endBefore(): GeoQuery {
    if (arguments.length === 1 && arguments[0] instanceof GeoDocumentSnapshot) {
      return new GeoQuery(this._query.endBefore(arguments[0]['_snapshot']), this.geoQueryCriteria);
    }
    return new GeoQuery(this._query.endBefore(...Array.from(arguments)), this.geoQueryCriteria);
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
      return Promise.all(queries).then(value => new GeoQuerySnapshot(this._joinQueries(value), this.geoQueryCriteria));
    } else {
      const promise = this._isWeb ?
        (this._query as GeoFirestoreTypes.web.Query).get(options) : (this._query as GeoFirestoreTypes.web.Query).get();
      return promise.then((snapshot) => new GeoQuerySnapshot(snapshot));
    }
  }

  /**
   * Creates and returns a new GeoQuery that's additionally limited to only return up to the specified number of documents.
   *
   * This function returns a new (immutable) instance of the GeoQuery (rather than modify the existing instance) to impose the limit.
   *
   * @param limit The maximum number of items to return.
   * @return The created GeoQuery.
   */
  public limit(limit: number): GeoQuery {
    return new GeoQuery(this._query.limit(limit), this.geoQueryCriteria);
  }

  /**
   * Creates and returns a new Query that's additionally sorted by the specified field, optionally in descending order instead of
   * ascending.
   *
   * This function returns a new (immutable) instance of the Query (rather than modify the existing instance) to impose the order.
   *
   * @param fieldPath The field to sort by.
   * @param directionStr Optional direction to sort by ('asc' or 'desc'). If not specified, order will be ascending.
   * @return The created Query.
   */
  public orderBy(
    fieldPath: string | GeoFirestoreTypes.cloud.FieldPath | GeoFirestoreTypes.web.FieldPath,
    directionStr?: GeoFirestoreTypes.cloud.OrderByDirection | GeoFirestoreTypes.web.OrderByDirection
  ): GeoQuery {
    return new GeoQuery(this._query.orderBy(fieldPath, directionStr), this.geoQueryCriteria);
  }

  /**
   * Creates and returns a new GeoQuery that starts after the provided document (exclusive). The starting position is relative to the order
   * of the query. The document must contain all of the fields provided in the orderBy of this query.
   *
   * @param snapshot The snapshot of the document to start after.
   * @return The created GeoQuery.
   */
  public startAfter(
    snapshot: GeoDocumentSnapshot | GeoFirestoreTypes.cloud.DocumentSnapshot | GeoFirestoreTypes.web.DocumentSnapshot
  ): GeoQuery;

  /**
   * Creates and returns a new GeoQuery that starts after the provided fields relative to the order of the query. The order of the field
   * values must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to start this query after, in order of the query's order by.
   * @return The created GeoQuery.
   */
  public startAfter(...fieldValues: any[]): GeoQuery;

  public startAfter(): GeoQuery {
    if (arguments.length === 1 && arguments[0] instanceof GeoDocumentSnapshot) {
      return new GeoQuery(this._query.startAfter(arguments[0]['_snapshot']), this.geoQueryCriteria);
    }
    return new GeoQuery(this._query.startAfter(...Array.from(arguments)), this.geoQueryCriteria);
  }

  /**
   * Creates and returns a new GeoQuery that starts at the provided document (inclusive). The starting position is relative to the order of
   * the query. The document must contain all of the fields provided in the orderBy of this query.
   *
   * @param snapshot The snapshot of the document to start after.
   * @return The created GeoQuery.
   */
  public startAt(
    snapshot: GeoDocumentSnapshot | GeoFirestoreTypes.cloud.DocumentSnapshot | GeoFirestoreTypes.web.DocumentSnapshot
  ): GeoQuery;

  /**
   * Creates and returns a new GeoQuery that starts at the provided fields relative to the order of the query. The order of the field
   * values must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to start this query at, in order of the query's order by.
   * @return The created GeoQuery.
   */
  public startAt(...fieldValues: any[]): GeoQuery;

  public startAt(): GeoQuery {
    if (arguments.length === 1 && arguments[0] instanceof GeoDocumentSnapshot) {
      return new GeoQuery(this._query.startAt(arguments[0]['_snapshot']), this.geoQueryCriteria);
    }
    return new GeoQuery(this._query.startAt(...Array.from(arguments)), this.geoQueryCriteria);
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
    opStr: GeoFirestoreTypes.cloud.WhereFilterOp | GeoFirestoreTypes.web.WhereFilterOp,
    value: any
  ): GeoQuery {
    return new GeoQuery(this._query.where(fieldPath, opStr, value), this.geoQueryCriteria);
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
   * Merges the results of an array of QuerySnapshots into one QuerySnapshot (like) object.
   *
   * @param results An array of QuerySnapshots from multiple queries.
   * @return A single QuerySnapshot from an array of QuerySnapshots.
   */
  private _joinQueries(results: GeoFirestoreTypes.web.QuerySnapshot[]): GeoFirestoreTypes.web.QuerySnapshot {
    const docs = [];
    const docChanges = [];

    results.forEach((value: GeoFirestoreTypes.web.QuerySnapshot) => {
      docs.concat(value.docs);
      docChanges.concat(value.docChanges());
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
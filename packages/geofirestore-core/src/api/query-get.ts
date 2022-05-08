import {GeoQuerySnapshot} from './snapshot';
import {validateQueryCriteria} from './validate';
import {GeoFirestoreTypes} from '../definitions';
import {calculateDistance, generateQuery} from '../utils';

/**
 * Executes a query and returns the result(s) as a GeoQuerySnapshot.
 *
 * WEB CLIENT ONLY
 * Note: By default, get() attempts to provide up-to-date data when possible by waiting for data from the server, but it may return
 * cached data or fail if you are offline and the server cannot be reached. This behavior can be altered via the `GetOptions` parameter.
 *
 * @param query The Firestore Query instance.
 * @param queryCriteria The query criteria of geo based queries, includes field such as center, radius, and limit.
 */
export function geoQueryGet(
  query: GeoFirestoreTypes.admin.Query | GeoFirestoreTypes.compat.Query,
  queryCriteria: GeoFirestoreTypes.QueryCriteria,
  options: GeoFirestoreTypes.compat.GetOptions = {source: 'default'}
): Promise<GeoQuerySnapshot> {
  const isWeb =
    Object.prototype.toString.call(
      (query as GeoFirestoreTypes.compat.CollectionReference).firestore
        .enablePersistence
    ) === '[object Function]';

  if (queryCriteria.center && typeof queryCriteria.radius === 'number') {
    const queries = generateQuery(query, queryCriteria).map(q =>
      isWeb ? q.get(options) : q.get()
    );

    return Promise.all(queries).then(value =>
      new GeoQueryGet(value, queryCriteria).getGeoQuerySnapshot()
    );
  } else {
    query = queryCriteria.limit ? query.limit(queryCriteria.limit) : query;
    const promise = isWeb
      ? (query as GeoFirestoreTypes.compat.Query).get(options)
      : (query as GeoFirestoreTypes.compat.Query).get();

    return promise.then(snapshot => new GeoQuerySnapshot(snapshot));
  }
}
/**
 * A `GeoJoinerGet` aggregates multiple `get` results.
 */
export class GeoQueryGet {
  private _docs: Map<string, GeoFirestoreTypes.compat.QueryDocumentSnapshot> =
    new Map();

  /**
   * @param snapshots An array of snpashots from a Firestore Query `get` call.
   * @param _queryCriteria The query criteria of geo based queries, includes field such as center, radius, and limit.
   */
  constructor(
    snapshots: GeoFirestoreTypes.compat.QuerySnapshot[],
    private _queryCriteria: GeoFirestoreTypes.QueryCriteria
  ) {
    validateQueryCriteria(_queryCriteria);

    snapshots.forEach((snapshot: GeoFirestoreTypes.compat.QuerySnapshot) => {
      snapshot.docs.forEach(doc => {
        const distance = calculateDistance(
          this._queryCriteria.center,
          (doc.data() as GeoFirestoreTypes.GeoDocumentData).g.geopoint
        );

        if (this._queryCriteria.radius >= distance) {
          this._docs.set(doc.id, doc);
        }
      });
    });

    if (
      this._queryCriteria.limit &&
      this._docs.size > this._queryCriteria.limit
    ) {
      const arrayToLimit = Array.from(this._docs.values())
        .map(doc => {
          return {
            distance: calculateDistance(
              this._queryCriteria.center,
              (doc.data() as GeoFirestoreTypes.GeoDocumentData).g.geopoint
            ),
            id: doc.id,
          };
        })
        .sort((a, b) => a.distance - b.distance);

      for (let i = this._queryCriteria.limit; i < arrayToLimit.length; i++) {
        this._docs.delete(arrayToLimit[i].id);
      }
    }
  }

  /**
   * Returns parsed docs as a GeoQuerySnapshot.
   *
   * @return A new `GeoQuerySnapshot` of the filtered documents from the `get`.
   */
  getGeoQuerySnapshot(): GeoQuerySnapshot {
    const docs = Array.from(this._docs.values());
    return new GeoQuerySnapshot(
      {
        docs,
        docChanges: () =>
          docs.map((doc, index) => {
            return {doc, newIndex: index, oldIndex: -1, type: 'added'};
          }),
      } as GeoFirestoreTypes.compat.QuerySnapshot,
      this._queryCriteria.center
    );
  }
}

import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoQuerySnapshot } from './GeoQuerySnapshot';
import { validateQueryCriteria, calculateDistance } from './utils';

/**
 * A `GeoJoinerGet` aggregates multiple `get` results.
 */
export class GeoJoinerGet {
  private _docs: Map<string, GeoFirestoreTypes.web.QueryDocumentSnapshot> = new Map();

  /**
   * @param snapshots An array of snpashots from a Firestore Query `get` call.
   * @param _queryCriteria The query criteria of geo based queries, includes field such as center, radius, and limit.
   */
  constructor(snapshots: GeoFirestoreTypes.web.QuerySnapshot[], private _queryCriteria: GeoFirestoreTypes.QueryCriteria) {
    validateQueryCriteria(_queryCriteria);

    snapshots.forEach((snapshot: GeoFirestoreTypes.web.QuerySnapshot) => {
      snapshot.docs.forEach((doc) => {
        const distance = calculateDistance(this._queryCriteria.center, doc.data().l);
        if (this._queryCriteria.radius >= distance) {
          this._docs.set(doc.id, doc);
        }
      });
    });

    if (this._queryCriteria.limit && this._docs.size > this._queryCriteria.limit) {
      const arrayToLimit = Array.from(this._docs.values()).map((doc) => {
        return {...doc, distance: calculateDistance(this._queryCriteria.center, doc.data().l)};
      }).sort((a, b) => a.distance - b.distance);

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
  public getGeoQuerySnapshot(): GeoQuerySnapshot {
    return new GeoQuerySnapshot(
      { docs: Array.from(this._docs.values()), docChanges: () => [] } as GeoFirestoreTypes.web.QuerySnapshot,
      this._queryCriteria.center
    );
  }
}
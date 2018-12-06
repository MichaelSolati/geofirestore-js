import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoQuerySnapshot } from './GeoQuerySnapshot';
import { validateQueryCriteria, calculateDistance } from './utils';

/**
 * A `GeoJoinerGet` aggregates multiple `get` results.
 */
export class GeoJoinerGet {
  private _docs: GeoFirestoreTypes.web.QueryDocumentSnapshot[] = [];

  /**
   * @param snapshots An array of snpashots from a Firestore Query `get` call.
   * @param _near The center and radius of geo based queries.
   */
  constructor(snapshots: GeoFirestoreTypes.web.QuerySnapshot[], private _near: GeoFirestoreTypes.QueryCriteria) {
    validateQueryCriteria(_near);

    snapshots.forEach((snapshot: GeoFirestoreTypes.web.QuerySnapshot) => {
      snapshot.docs.forEach((doc) => {
        const distance = calculateDistance(this._near.center, doc.data().l);
        if (this._near.radius >= distance) {
          this._docs.push(doc);
        }
      });
    });
  }

  /**
   * Returns parsed docs as a GeoQuerySnapshot.
   * 
   * @return A new `GeoQuerySnapshot` of the filtered documents from the `get`.
   */
  public getGeoQuerySnapshot(): GeoQuerySnapshot {
    return new GeoQuerySnapshot({ docs: this._docs, docChanges: () => [] } as GeoFirestoreTypes.web.QuerySnapshot, this._near.center);
  }
}
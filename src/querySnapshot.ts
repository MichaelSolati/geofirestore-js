import { GeoFirestoreTypes } from './interfaces';
import { generateGeoQueryDocumentSnapshot, validateQueryCriteria } from './utils';

/**
 * A `GeoQuerySnapshot` contains zero or more `QueryDocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
export class GeoQuerySnapshot {
  private _docs: GeoFirestoreTypes.QueryDocumentSnapshot[];
  private _center: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint;
  private _radius: number;

  /**
   * @param _querySnapshot The `QuerySnapshot` instance.
   * @param geoQueryCriteria The center and radius of geo based queries.
   */
  constructor(
    private _querySnapshot: GeoFirestoreTypes.web.QuerySnapshot | GeoFirestoreTypes.cloud.QuerySnapshot,
    geoQueryCriteria?: GeoFirestoreTypes.QueryCriteria
  ) {
    if (geoQueryCriteria) {
      // Validate and save the query criteria
      validateQueryCriteria(geoQueryCriteria);
      this._center = geoQueryCriteria.center;
      this._radius = geoQueryCriteria.radius;
    }

    this._docs = (this._querySnapshot as GeoFirestoreTypes.web.QuerySnapshot).docs
    .reduce((filtered: GeoFirestoreTypes.QueryDocumentSnapshot[], snapshot: GeoFirestoreTypes.web.QueryDocumentSnapshot) => {
      const documentSnapshot = generateGeoQueryDocumentSnapshot(snapshot, this._center);
      if (this._center && this._radius) {
        if (this._radius >= documentSnapshot.distance) {
          filtered.push(documentSnapshot);
        }
      } else {
        filtered.push(documentSnapshot);
      }
      return filtered;
    }, []);
  }

  /** An array of all the documents in the GeoQuerySnapshot. */
  get docs(): GeoFirestoreTypes.QueryDocumentSnapshot[] {
    return this._docs;
  }

  /** The number of documents in the GeoQuerySnapshot. */
  get size(): number {
    return this._docs.length;
  }

  /** True if there are no documents in the GeoQuerySnapshot. */
  get empty(): boolean {
    return Boolean(this._docs.length);
  }

  /**
   * Returns an array of the documents changes since the last snapshot. If
   * this is the first snapshot, all documents will be in the list as added
   * changes.
   * 
   * @returns Array of DocumentChanges.
   */
  public docChanges(): GeoFirestoreTypes.DocumentChange[] {
    return (this._querySnapshot.docChanges() as GeoFirestoreTypes.web.DocumentChange[])
      .reduce((filtered: GeoFirestoreTypes.DocumentChange[], change: GeoFirestoreTypes.web.DocumentChange) => {
        const documentChange = {
          doc: generateGeoQueryDocumentSnapshot(change.doc, this._center),
          newIndex: change.newIndex,
          oldIndex: change.oldIndex,
          type: change.type
        };
        if (this._center && this._radius) {
          if (this._radius >= documentChange.doc.distance) {
            filtered.push(documentChange);
          }
        } else {
          filtered.push(documentChange);
        }
        return filtered;
      }, []);
  }

  /**
   * Enumerates all of the documents in the GeoQuerySnapshot.
   *
   * @param callback A callback to be called with a `DocumentSnapshot` for
   * each document in the snapshot.
   * @param thisArg The `this` binding for the callback.
   */
  public forEach(callback: (result: GeoFirestoreTypes.QueryDocumentSnapshot) => void, thisArg?: any): void {
    this.docs.forEach(callback, thisArg);
  }
}
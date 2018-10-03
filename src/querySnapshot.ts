import { FirestoreWeb, FirestoreCloud, GeoDocumentChange, GeoQueryDocumentSnapshot, GeoQueryCriteria } from './interfaces';
import { generateGeoQueryDocumentSnapshot, validateQueryCriteria } from './utils';

/**
 * A `GeoQuerySnapshot` contains zero or more `QueryDocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
export class GeoQuerySnapshot {
  private _center: FirestoreCloud.GeoPoint | FirestoreWeb.GeoPoint;
  private _radius: number;

  constructor(private _querySnapshot: FirestoreWeb.QuerySnapshot | FirestoreCloud.QuerySnapshot, geoQueryCriteria?: GeoQueryCriteria) {
    if (geoQueryCriteria) {
      // Validate and save the query criteria
      validateQueryCriteria(geoQueryCriteria);
      this._center = geoQueryCriteria.center;
      this._radius = geoQueryCriteria.radius;
    }
  }

  /** An array of all the documents in the GeoQuerySnapshot. */
  get docs(): GeoQueryDocumentSnapshot[] {
    return (this._querySnapshot as FirestoreWeb.QuerySnapshot).docs.reduce((filtered: GeoQueryDocumentSnapshot[], snapshot: FirestoreWeb.QueryDocumentSnapshot) => {
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

  /** The number of documents in the GeoQuerySnapshot. */
  get size(): number {
    return this._querySnapshot.size;
  }

  /** True if there are no documents in the GeoQuerySnapshot. */
  get empty(): boolean {
    return this._querySnapshot.empty;
  }

  /**
   * Returns an array of the documents changes since the last snapshot. If
   * this is the first snapshot, all documents will be in the list as added
   * changes.
   */
  public docChanges(): GeoDocumentChange[] {
    return (this._querySnapshot.docChanges() as FirestoreWeb.DocumentChange[]).reduce((filtered: GeoDocumentChange[], change: FirestoreWeb.DocumentChange) => {
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
  public forEach(callback: (result: GeoQueryDocumentSnapshot) => void, thisArg?: any): void {
    this.docs.forEach(callback, thisArg);
  }
}
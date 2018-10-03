import { FirestoreWeb, FirestoreCloud, GeoDocumentChange, GeoQueryDocumentSnapshot } from './interfaces';
import { generateGeoQueryDocumentSnapshot } from './utils';

/**
 * A `GeoQuerySnapshot` contains zero or more `QueryDocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
export class GeoQuerySnapshot {
  constructor(private _querySnapshot: FirestoreWeb.QuerySnapshot | FirestoreCloud.QuerySnapshot) { }

  /** An array of all the documents in the GeoQuerySnapshot. */
  get docs(): GeoQueryDocumentSnapshot[] {
    return (this._querySnapshot as FirestoreWeb.QuerySnapshot).docs.map(snapshot => generateGeoQueryDocumentSnapshot(snapshot));
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
    return (this._querySnapshot.docChanges() as FirestoreWeb.DocumentChange[]).map((e: FirestoreWeb.DocumentChange) => {
      return {
        doc: generateGeoQueryDocumentSnapshot(e.doc),
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        type: e.type
      };
    });
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
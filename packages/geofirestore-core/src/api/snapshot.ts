import {validateLocation} from './validate';
import {GeoFirestoreTypes} from '../definitions';
import {generateGeoQueryDocumentSnapshot} from '../utils';

/**
 * A `GeoQuerySnapshot` contains zero or more `QueryDocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
export class GeoQuerySnapshot {
  private _docs: GeoFirestoreTypes.QueryDocumentSnapshot[];

  /**
   * @param _querySnapshot The `QuerySnapshot` instance.
   * @param geoQueryCriteria The center and radius of geo based queries.
   */
  constructor(
    private _querySnapshot:
      | GeoFirestoreTypes.compat.QuerySnapshot
      | GeoFirestoreTypes.admin.QuerySnapshot,
    private _center?:
      | GeoFirestoreTypes.admin.GeoPoint
      | GeoFirestoreTypes.compat.GeoPoint
  ) {
    if (_center) {
      // Validate the _center coordinates
      validateLocation(_center);
    }

    this._docs = (
      _querySnapshot as GeoFirestoreTypes.admin.QuerySnapshot
    ).docs.map((snapshot: GeoFirestoreTypes.admin.QueryDocumentSnapshot) =>
      generateGeoQueryDocumentSnapshot(snapshot, _center)
    );
  }

  /** The native `QuerySnapshot` instance. */
  get native():
    | GeoFirestoreTypes.admin.QuerySnapshot
    | GeoFirestoreTypes.compat.QuerySnapshot {
    return this._querySnapshot;
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
    return !this._docs.length;
  }

  /**
   * Returns an array of the documents changes since the last snapshot. If
   * this is the first snapshot, all documents will be in the list as added
   * changes.
   *
   * @returns Array of DocumentChanges.
   */
  docChanges(): GeoFirestoreTypes.DocumentChange[] {
    const docChanges = Array.isArray(this._querySnapshot.docChanges)
      ? (this._querySnapshot
          .docChanges as any as GeoFirestoreTypes.compat.DocumentChange[])
      : this._querySnapshot.docChanges();
    return (docChanges as GeoFirestoreTypes.compat.DocumentChange[]).map(
      (change: GeoFirestoreTypes.compat.DocumentChange) => {
        return {
          doc: generateGeoQueryDocumentSnapshot(change.doc, this._center),
          newIndex: change.newIndex,
          oldIndex: change.oldIndex,
          type: change.type,
        };
      }
    );
  }

  /**
   * Enumerates all of the documents in the GeoQuerySnapshot.
   *
   * @param callback A callback to be called with a `DocumentSnapshot` for
   * each document in the snapshot.
   * @param thisArg The `this` binding for the callback.
   */
  forEach(
    callback: (result: GeoFirestoreTypes.QueryDocumentSnapshot) => void,
    thisArg?: any
  ): void {
    this.docs.forEach(callback, thisArg);
  }
}

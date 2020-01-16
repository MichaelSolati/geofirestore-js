import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoDocumentReference } from './GeoDocumentReference';
import { decodeGeoDocumentData } from './utils';

/**
 * A `GeoDocumentSnapshot` contains data read from a document in your Firestore database. The data can be extracted with `.data()` or
 * `.get(<field>)` to get a specific field.
 *
 * For a `GeoDocumentSnapshot` that points to a non-existing document, any data access will return 'undefined'. You can use the `exists`
 * property to explicitly verify a document's existence.
 */
export class GeoDocumentSnapshot {
  private _isWeb: boolean;

  /**
   * @param _snapshot The `DocumentSnapshot` instance.
   */
  constructor(private _snapshot: GeoFirestoreTypes.cloud.DocumentSnapshot | GeoFirestoreTypes.web.DocumentSnapshot) {
    if (Object.prototype.toString.call(_snapshot) !== '[object Object]') {
      throw new Error('DocumentSnapshot must be an instance of a Firestore DocumentSnapshot');
    }
    this._isWeb = Object.prototype.toString
      .call((_snapshot as GeoFirestoreTypes.web.DocumentSnapshot).ref.firestore.enablePersistence) === '[object Function]';
  }

  /** The native `DocumentSnapshot` instance. */
  get native(): GeoFirestoreTypes.cloud.DocumentSnapshot | GeoFirestoreTypes.web.DocumentSnapshot {
    return this._snapshot;
  }

  /** True if the document exists. */
  get exists(): boolean {
    return this._snapshot.exists;
  }

  /**
   * The ID of the document for which this `GeoDocumentSnapshot` contains data.
   */
  get id(): string {
    return this._snapshot.id;
  }

  /** A `GeoDocumentReference` to the document location. */
  get ref(): GeoDocumentReference {
    return new GeoDocumentReference(this._snapshot.ref);
  }

  /**
   * Retrieves all fields in the document as an Object. Returns 'undefined' if the document doesn't exist.
   *
   * By default, `FieldValue.serverTimestamp()` values that have not yet been set to their final value will be returned as `null`. You can
   * override this by passing an options object if you're on web.
   *
   * @param options Available on web only. An options object to configure how data is retrieved from the snapshot (e.g. the desired
   * behavior for server timestamps that have not yet been set to their final value). (WEB ONLY)
   * @return An Object containing all fields in the document or 'undefined' if the document doesn't exist.
   */
  data(options?: GeoFirestoreTypes.SnapshotOptions): GeoFirestoreTypes.DocumentData | undefined {
    const d = (this._isWeb && options) ? (this._snapshot as GeoFirestoreTypes.web.DocumentSnapshot).data(options) : this._snapshot.data();
    return (d) ? decodeGeoDocumentData(d as GeoFirestoreTypes.Document) : null;
  }

  /**
   * Retrieves the field specified by `fieldPath`. Returns 'undefined' if the document or field doesn't exist.
   *
   * By default, a `FieldValue.serverTimestamp()` that has not yet been set to its final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @param fieldPath The path (e.g. 'foo' or 'foo.bar') to a specific field.
   * @param options An options object to configure how the field is retrieved from the snapshot (e.g. the desired behavior for server
   * timestamps that have not yet been set to their final value). (WEB ONLY)
   * @return The data at the specified field location or undefined if no such field exists in the document.
   */
  get(
    fieldPath: string | GeoFirestoreTypes.cloud.FieldPath | GeoFirestoreTypes.web.FieldPath,
    options?: GeoFirestoreTypes.SnapshotOptions
  ): any {
    const path = 'd.' + fieldPath;
    return (this._isWeb && options) ?
      (this._snapshot as GeoFirestoreTypes.web.DocumentSnapshot).get(path, options) : this._snapshot.get(path);
  }

  /**
   * Returns true if this `DocumentSnapshot` or `GeoDocumentSnapshot` is equal to the provided one.
   *
   * @param other The `DocumentSnapshot` or `GeoDocumentSnapshot` to compare against.
   * @return true if this `GeoDocumentSnapshot` is equal to the provided one.
   */
  isEqual(other: GeoDocumentSnapshot | GeoFirestoreTypes.cloud.DocumentSnapshot | GeoFirestoreTypes.web.DocumentSnapshot): boolean {
    if (other instanceof GeoDocumentSnapshot) {
      return (this._snapshot as GeoFirestoreTypes.cloud.DocumentSnapshot)
        .isEqual(other['_snapshot'] as GeoFirestoreTypes.cloud.DocumentSnapshot);
    }
    return (this._snapshot as GeoFirestoreTypes.cloud.DocumentSnapshot).isEqual(other as GeoFirestoreTypes.cloud.DocumentSnapshot);
  }
}
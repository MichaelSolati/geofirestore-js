import {
  GeoFirestoreTypes,
  encodeDocumentSet,
  encodeDocumentUpdate,
} from 'geofirestore-core';

import {GeoDocumentReference} from './GeoDocumentReference';
import {sanitizeSetOptions} from '../utils';

/**
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `GeoWriteBatch` object can be acquired by calling `GeoFirestore.batch()`. It provides methods for adding writes to the write batch.
 * None of the writes will be committed (or visible locally) until `GeoWriteBatch.commit()` is called.
 *
 * Unlike transactions, write batches are persisted offline and therefore are preferable when you don't need to condition your writes on
 * read data.
 */
export class GeoWriteBatch {
  /**
   * @param _writeBatch The `WriteBatch` instance.
   * @param _customKey Key to use for GeoPoints in a write batch.
   */
  constructor(
    private _writeBatch:
      | GeoFirestoreTypes.cloud.WriteBatch
      | GeoFirestoreTypes.web.WriteBatch,
    private _customKey?: string
  ) {
    if (Object.prototype.toString.call(_writeBatch) !== '[object Object]') {
      throw new Error(
        'WriteBatch must be an instance of a Firestore WriteBatch'
      );
    }
  }

  /** The native `WriteBatch` instance. */
  get native():
    | GeoFirestoreTypes.cloud.WriteBatch
    | GeoFirestoreTypes.web.WriteBatch {
    return this._writeBatch;
  }

  /**
   * Writes to the document referred to by the provided `DocumentReference` or `GeoDocumentReference`. If the document does not exist yet,
   * it will be created. If you pass `SetOptions`, the provided data can be merged into the existing document.
   *
   * @param documentRef A reference to the document to be set.
   * @param documentData An object of the fields and values for the document.
   * @param options An object to configure the set behavior. Includes custom key for location in document.
   * @return This `GeoWriteBatch` instance. Used for chaining method calls.
   */
  set(
    documentRef:
      | GeoDocumentReference
      | GeoFirestoreTypes.cloud.DocumentReference
      | GeoFirestoreTypes.web.DocumentReference,
    documentData: GeoFirestoreTypes.DocumentData,
    options: GeoFirestoreTypes.SetOptions = {}
  ): GeoWriteBatch {
    const ref: any =
      documentRef instanceof GeoDocumentReference
        ? documentRef['_document']
        : documentRef;
    options.customKey = options.customKey || this._customKey;
    (this._writeBatch as GeoFirestoreTypes.cloud.WriteBatch).set(
      ref,
      encodeDocumentSet(documentData, options),
      sanitizeSetOptions(options)
    );
    return this;
  }

  /**
   * Updates fields in the document referred to by the provided `DocumentReference` or `GeoDocumentReference`. The update will fail if
   * applied to a document that does not exist.
   *
   * @param documentRef A reference to the document to be updated.
   * @param data An object containing the fields and values with which to update the document. Fields can contain dots to reference nested
   * fields within the document.
   * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
   * @return This `GeoWriteBatch` instance. Used for chaining method calls.
   */
  update(
    documentRef:
      | GeoDocumentReference
      | GeoFirestoreTypes.cloud.DocumentReference
      | GeoFirestoreTypes.web.DocumentReference,
    data: GeoFirestoreTypes.UpdateData,
    customKey: string = this._customKey
  ): GeoWriteBatch {
    const ref: any =
      documentRef instanceof GeoDocumentReference
        ? documentRef['_document']
        : documentRef;
    (this._writeBatch as GeoFirestoreTypes.cloud.WriteBatch).update(
      ref,
      encodeDocumentUpdate(data, customKey)
    );
    return this;
  }

  /**
   * Deletes the document referred to by the provided `DocumentReference` or `GeoDocumentReference`.
   *
   * @param documentRef A reference to the document to be deleted.
   * @return This `WriteBatch` instance. Used for chaining method calls.
   */
  delete(
    documentRef:
      | GeoDocumentReference
      | GeoFirestoreTypes.cloud.DocumentReference
      | GeoFirestoreTypes.web.DocumentReference
  ): GeoWriteBatch {
    const ref: any =
      documentRef instanceof GeoDocumentReference
        ? documentRef['_document']
        : documentRef;
    (this._writeBatch as GeoFirestoreTypes.cloud.WriteBatch).delete(ref);
    return this;
  }

  /**
   * Commits all of the writes in this write batch as a single atomic unit.
   *
   * @return A Promise resolved once all of the writes in the batch have been successfully written to the backend as an atomic unit. Note
   * that it won't resolve while you're offline.
   */
  commit(): Promise<any> {
    return this._writeBatch.commit();
  }
}

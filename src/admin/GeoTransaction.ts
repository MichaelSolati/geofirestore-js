import {
  GeoFirestoreTypes,
  encodeDocumentSet,
  encodeDocumentUpdate,
} from 'geofirestore-core';

import {GeoDocumentReference} from './GeoDocumentReference';
import {GeoDocumentSnapshot} from './GeoDocumentSnapshot';
import {sanitizeSetOptions} from '../utils';

/**
 * A reference to a transaction. The `GeoTransaction` object passed to a transaction's updateFunction provides the methods to read and
 * write data within the transaction context. See `GeoFirestore.runTransaction()`.
 */
export class GeoTransaction {
  /**
   * @param _transaction The `Transaction` instance.
   * @param _customKey Key to use for GeoPoints in a transaction.
   */
  constructor(
    private _transaction:
      | GeoFirestoreTypes.cloud.Transaction
      | GeoFirestoreTypes.web.Transaction,
    private _customKey?: string
  ) {
    if (Object.prototype.toString.call(_transaction) !== '[object Object]') {
      throw new Error(
        'Transaction must be an instance of a Firestore Transaction'
      );
    }
  }

  /** The native `Transaction` instance. */
  get native():
    | GeoFirestoreTypes.cloud.Transaction
    | GeoFirestoreTypes.web.Transaction {
    return this._transaction;
  }

  /**
   * Deletes the document referred to by the provided `GeoDocumentReference` or `DocumentReference`.
   *
   * @param documentRef A reference to the document to be deleted.
   * @return This `GeoTransaction` instance. Used for chaining method calls.
   */
  delete(
    documentRef:
      | GeoDocumentReference
      | GeoFirestoreTypes.cloud.DocumentReference
      | GeoFirestoreTypes.web.DocumentReference
  ): GeoTransaction {
    const ref: any =
      documentRef instanceof GeoDocumentReference
        ? documentRef['_document']
        : documentRef;
    this._transaction.delete(ref);
    return this;
  }

  /**
   * Reads the document referenced by the provided `GeoDocumentReference` or `DocumentReference`.
   *
   * @param documentRef A reference to the document to be read.
   * @return A GeoDocumentSnapshot for the read data.
   */
  get(
    documentRef:
      | GeoDocumentReference
      | GeoFirestoreTypes.cloud.DocumentReference
      | GeoFirestoreTypes.web.DocumentReference
  ): Promise<GeoDocumentSnapshot> {
    const ref: any =
      documentRef instanceof GeoDocumentReference
        ? documentRef['_document']
        : documentRef;
    return (this._transaction as GeoFirestoreTypes.cloud.Transaction)
      .get(ref)
      .then((snpashot: any) => new GeoDocumentSnapshot(snpashot));
  }

  /**
   * Writes to the document referred to by the provided `GeoDocumentReference` or `DocumentReference`.
   * If the document does not exist yet, it will be created. If you pass `SetOptions`,
   * the provided data can be merged into the existing document.
   *
   * @param documentRef A reference to the document to be set.
   * @param documentData An object of the fields and values for the document.
   * @param options An object to configure the set behavior. Includes custom key for location in document.
   * @return This `GeoTransaction` instance. Used for chaining method calls.
   */
  set(
    documentRef:
      | GeoDocumentReference
      | GeoFirestoreTypes.cloud.DocumentReference
      | GeoFirestoreTypes.web.DocumentReference,
    documentData: GeoFirestoreTypes.DocumentData,
    options: GeoFirestoreTypes.SetOptions = {}
  ): GeoTransaction {
    const ref: any =
      documentRef instanceof GeoDocumentReference
        ? documentRef['_document']
        : documentRef;
    options.customKey = options.customKey || this._customKey;
    (this._transaction as GeoFirestoreTypes.cloud.Transaction).set(
      ref,
      encodeDocumentSet(documentData, options),
      sanitizeSetOptions(options)
    );
    return this;
  }

  /**
   * Updates fields in the document referred to by the provided `GeoDocumentReference` or `DocumentReference`.
   * The update will fail if applied to a document that does not exist.
   *
   * @param documentRef A reference to the document to be updated.
   * @param data An object containing the fields and values with which to update the document. Fields can contain dots to reference nested
   * fields within the document.
   * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
   * @return This `GeoTransaction` instance. Used for chaining method calls.
   */
  update(
    documentRef:
      | GeoDocumentReference
      | GeoFirestoreTypes.cloud.DocumentReference
      | GeoFirestoreTypes.web.DocumentReference,
    data: GeoFirestoreTypes.UpdateData,
    customKey: string = this._customKey
  ): GeoTransaction {
    const ref: any =
      documentRef instanceof GeoDocumentReference
        ? documentRef['_document']
        : documentRef;
    (this._transaction as GeoFirestoreTypes.cloud.Transaction).update(
      ref,
      encodeDocumentUpdate(data, customKey)
    );
    return this;
  }
}

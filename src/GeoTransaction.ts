import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoDocumentReference } from './GeoDocumentReference';
import { GeoDocumentSnapshot } from './GeoDocumentSnapshot';
import { encodeSetDocument, encodeUpdateDocument, sanitizeSetOptions } from './utils';

/**
 * A reference to a transaction. The `GeoTransaction` object passed to a transaction's updateFunction provides the methods to read and
 * write data within the transaction context. See `GeoFirestore.runTransaction()`.
 */
export class GeoTransaction {
  constructor(private _transaction: GeoFirestoreTypes.cloud.Transaction | GeoFirestoreTypes.web.Transaction) {
    if (Object.prototype.toString.call(_transaction) !== '[object Object]') {
      throw new Error('Transaction must be an instance of a Firestore Transaction');
    }
  }

  /**
   * Deletes the document referred to by the provided `GeoDocumentReference` or `DocumentReference`.
   *
   * @param documentRef A reference to the document to be deleted.
   * @return This `GeoTransaction` instance. Used for chaining method calls.
   */
  public delete(
    documentRef: GeoDocumentReference | GeoFirestoreTypes.cloud.DocumentReference | GeoFirestoreTypes.web.DocumentReference
  ): GeoTransaction {
    const ref = ((documentRef instanceof GeoDocumentReference) ?
      documentRef['_document'] : documentRef) as GeoFirestoreTypes.cloud.DocumentReference;
    (this._transaction as GeoFirestoreTypes.cloud.Transaction).delete(ref);
    return this;
  }

  /**
   * Reads the document referenced by the provided `GeoDocumentReference` or `DocumentReference`.
   *
   * @param documentRef A reference to the document to be read.
   * @return A GeoDocumentSnapshot for the read data.
   */
  public get(
    documentRef: GeoDocumentReference | GeoFirestoreTypes.cloud.DocumentReference | GeoFirestoreTypes.web.DocumentReference
  ): Promise<GeoDocumentSnapshot> {
    const ref = ((documentRef instanceof GeoDocumentReference) ?
      documentRef['_document'] : documentRef) as GeoFirestoreTypes.cloud.DocumentReference;
    return (this._transaction as GeoFirestoreTypes.cloud.Transaction).get(ref).then(snpashot => new GeoDocumentSnapshot(snpashot));
  }

  /**
   * Writes to the document referred to by the provided `GeoDocumentReference` or `DocumentReference`.
   * If the document does not exist yet, it will be created. If you pass `SetOptions`,
   * the provided data can be merged into the existing document.
   *
   * @param documentRef A reference to the document to be set.
   * @param data An object of the fields and values for the document.
   * @param options An object to configure the set behavior. Includes custom key for location in document.
   * @return This `GeoTransaction` instance. Used for chaining method calls.
   */
  public set(
    documentRef: GeoDocumentReference | GeoFirestoreTypes.cloud.DocumentReference | GeoFirestoreTypes.web.DocumentReference,
    data: GeoFirestoreTypes.DocumentData,
    options?: GeoFirestoreTypes.SetOptions
  ): GeoTransaction {
    const ref = ((documentRef instanceof GeoDocumentReference) ?
      documentRef['_document'] : documentRef) as GeoFirestoreTypes.cloud.DocumentReference;
    (this._transaction as GeoFirestoreTypes.cloud.Transaction).set(
      ref, 
      encodeSetDocument(data, options), 
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
  public update(
    documentRef: GeoDocumentReference | GeoFirestoreTypes.cloud.DocumentReference | GeoFirestoreTypes.web.DocumentReference,
    data: GeoFirestoreTypes.UpdateData,
    customKey?: string
  ): GeoTransaction {
    const ref = ((documentRef instanceof GeoDocumentReference) ?
      documentRef['_document'] : documentRef) as GeoFirestoreTypes.cloud.DocumentReference;
    (this._transaction as GeoFirestoreTypes.cloud.Transaction).update(ref, encodeUpdateDocument(data, customKey));
    return this;
  }
}

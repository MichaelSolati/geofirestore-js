import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoDocumentReference } from './GeoDocumentReference';

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
      documentRef['_document'] : documentRef) as GeoFirestoreTypes.web.DocumentReference;
    (this._transaction as GeoFirestoreTypes.web.Transaction).delete(ref);
    return this;
  }
}
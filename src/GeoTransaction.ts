import { GeoFirestoreTypes } from './GeoFirestoreTypes';

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
}
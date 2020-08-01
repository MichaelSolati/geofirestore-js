import {GeoFirestoreTypes} from 'geofirestore-core';

import {GeoCollectionReference} from './GeoCollectionReference';
import {GeoDocumentReference} from './GeoDocumentReference';
import {GeoQuery} from './GeoQuery';
import {GeoWriteBatch} from './GeoWriteBatch';

/**
 * `GeoFirestore` represents a Firestore Database and is the entry point for all GeoFirestore operations.
 */
export class GeoFirestore {
  /**
   * @param _firestore Firestore represents a Firestore Database and is the entry point for all Firestore operations.
   */
  constructor(
    private _firestore:
      | GeoFirestoreTypes.web.Firestore
      | GeoFirestoreTypes.cloud.Firestore
  ) {
    if (Object.prototype.toString.call(_firestore) !== '[object Object]') {
      throw new Error('Firestore must be an instance of Firestore');
    }
  }

  /** The native `Firestore` instance. */
  get native():
    | GeoFirestoreTypes.cloud.Firestore
    | GeoFirestoreTypes.web.Firestore {
    return this._firestore;
  }

  /**
   * Creates a write batch, used for performing multiple writes as a single atomic operation.
   *
   * @param customKey Key to use for GeoPoints in a write batch.
   * @return A new `GeoWriteBatch` instance.
   */
  batch(customKey?: string): GeoWriteBatch {
    return new GeoWriteBatch(this._firestore.batch(), customKey);
  }

  /**
   * Gets a `GeoCollectionReference` instance that refers to the collection at the specified path.
   *
   * @param collectionPath A slash-separated path to a collection.
   * @param customKey Key to use for GeoPoints in a collection.
   * @return A new `GeoCollectionReference` instance.
   */
  collection(
    collectionPath: string,
    customKey?: string
  ): GeoCollectionReference {
    return new GeoCollectionReference(
      this._firestore.collection(collectionPath),
      customKey
    );
  }

  /**
   * Creates and returns a new GeoQuery that includes all documents in the
   * database that are contained in a collection or subcollection with the
   * given collectionId.
   *
   * @param collectionId Identifies the collections to query over. Every
   * collection or subcollection with this ID as the last segment of its path
   * will be included. Cannot contain a slash.
   * @return The created GeoQuery.
   */
  collectionGroup(collectionId: string): GeoQuery {
    return new GeoQuery(this._firestore.collectionGroup(collectionId));
  }

  /**
   * Gets a `GeoDocumentReference` instance that refers to the document at the
   * specified path.
   *
   * @param documentPath A slash-separated path to a document.
   * @return The `GeoDocumentReference` instance.
   */
  doc(documentPath: string): GeoDocumentReference {
    return new GeoDocumentReference(this._firestore.doc(documentPath));
  }

  /**
   * Executes the given updateFunction and then attempts to commit the changes applied within the transaction. If any document read within
   * the transaction has changed, the updateFunction will be retried. If it fails to commit after 5 attempts, the transaction will fail.
   *
   * Note: The `updateFunction` passed into `runTransaction` is a standard Firestore transaction. You should then immediateley create a
   * `GeoTransaction` to then make your calls to. Below is a small example on how to do that.
   *
   * @example
   * ```typescript
   * const geofirestore = new GeoFirestore(firebase.firestore());
   * const sfDocRef = geofirestore.collection('cities').doc('SF');
   *
   * geofirestore.runTransaction((transaction) => {
   *  // Immediateley create a `GeoTransaction` from the `transaction`
   *  const geotransaction = new GeoTransaction(transaction);
   *  // This code may get re-run multiple times if there are conflicts.
   *  return geotransaction.get(sfDocRef).then((sfDoc) => {
   *    if (!sfDoc.exists) {
   *      throw Error('Document does not exist!');
   *    }
   *    const newPopulation = sfDoc.data().population + 1;
   *    geotransaction.update(sfDocRef, { population: newPopulation });
   *  });
   * });
   * ```
   *
   * @param updateFunction The function to execute within the transaction context.
   * @return If the transaction completed successfully or was explicitly aborted (by the updateFunction returning a failed Promise), the
   * Promise returned by the updateFunction will be returned here. Else if the transaction failed, a rejected Promise with the
   * corresponding failure error will be returned.
   */
  runTransaction(
    updateFunction: (
      transaction:
        | GeoFirestoreTypes.cloud.Transaction
        | GeoFirestoreTypes.web.Transaction
    ) => Promise<any>
  ): Promise<any> {
    return (this
      ._firestore as GeoFirestoreTypes.cloud.Firestore).runTransaction(
      updateFunction
    );
  }

  /**
   * Specifies custom settings to be used to configure the `Firestore`
   * instance. Can only be invoked once and before any other Firestore
   * method.
   *
   * If settings are provided via both `settings()` and the `Firestore`
   * constructor, both settings objects are merged and any settings provided
   * via `settings()` take precedence.
   */
  settings(
    settings: GeoFirestoreTypes.cloud.Settings | GeoFirestoreTypes.web.Settings
  ): void {
    this._firestore.settings(settings);
  }
}

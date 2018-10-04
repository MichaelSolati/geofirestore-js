import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoCollectionReference } from './GeoCollectionReference';
import { GeoWriteBatch } from './GeoWriteBatch';

/**
 * `GeoFirestore` represents a Firestore Database and is the entry point for all GeoFirestore operations.
 */
export class GeoFirestore {
  /**
   * @param _firestore Firestore represents a Firestore Database and is the entry point for all Firestore operations.
   */
  constructor(private _firestore: GeoFirestoreTypes.web.Firestore | GeoFirestoreTypes.cloud.Firestore) {
    if (Object.prototype.toString.call(_firestore) !== '[object Object]') {
      throw new Error('Firestore must be an instance of Firestore');
    }
  }

  /**
   * Creates a write batch, used for performing multiple writes as a single atomic operation.
   * 
   * @return A new `GeoWriteBatch` instance.
   */
  public batch(): GeoWriteBatch {
    return new GeoWriteBatch(this._firestore.batch());
  }

  /**
   * Gets a `GeoCollectionReference` instance that refers to the collection at the specified path.
   *
   * @param collectionPath A slash-separated path to a collection.
   * @return A new `GeoCollectionReference` instance.
   */
  public collection(collectionPath: string): GeoCollectionReference {
    return new GeoCollectionReference(this._firestore.collection(collectionPath));
  }
}

import { GeoFirestoreTypes } from './interfaces';
import { GeoCollectionReference } from './collection';
import { GeoWriteBatch } from './writeBatch';

/**
 * Creates a GeoFirestore instance.
 */
export class GeoFirestore {
  /**
   * @param _firestore Firestore represents a Firestore Database and is the entry point for all Firestore operations.
   */
  constructor(private _firestore: GeoFirestoreTypes.web.Firestore | GeoFirestoreTypes.cloud.Firestore) {
    if (Object.prototype.toString.call(_firestore) !== '[object Object]') {
      throw new Error('Firestore must be an instance of a Firestore');
    }
  }

  /**
   * Gets a `GeoCollectionReference` instance that refers to the collection at
   * the specified path.
   *
   * @param collectionPath A slash-separated path to a collection.
   * @return The `GeoCollectionReference` instance.
   */
  public collection(collectionPath: string): GeoCollectionReference {
    return new GeoCollectionReference(this._firestore.collection(collectionPath));
  }
}

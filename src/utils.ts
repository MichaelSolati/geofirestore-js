import {GeoFirestoreTypes} from 'geofirestore-core';
import {GeoFirestore} from './GeoFirestore';

/**
 * Initializes GeoFirestore instance.
 * @param firestore Firestore represents a Firestore Database and is the entry point for all Firestore operations.
 * @return GeoFirestore instance.
 */
export function initializeApp(
  firestore: GeoFirestoreTypes.web.Firestore | GeoFirestoreTypes.cloud.Firestore
): GeoFirestore {
  return new GeoFirestore(firestore);
}

/**
 * Remove customKey attribute so firestore doesn't' reject.
 *
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @return The same object but without custom key
 */
export function sanitizeSetOptions(
  options: GeoFirestoreTypes.SetOptions
): GeoFirestoreTypes.SetOptions {
  const clone = {...options};
  delete clone.customKey;
  return clone;
}

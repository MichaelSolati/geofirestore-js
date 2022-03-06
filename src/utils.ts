import {GeoFirestoreTypes} from 'geofirestore-core';

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

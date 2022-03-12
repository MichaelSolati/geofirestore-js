import {updateDoc as nUpdateDoc} from 'firebase/firestore';
import {GeoFirestoreTypes, encodeDocumentUpdate} from 'geofirestore-core';

/**
 * Updates fields in the document referred to by the specified
 * `DocumentReference`. The update will fail if applied to a document that does
 * not exist.
 *
 * @param reference - A reference to the document to update.
 * @param data - An object containing the fields and values with which to
 * update the document. Fields can contain dots to reference nested fields
 * within the document.
 * @param customKey - The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export function updateDoc<T>(
  reference: GeoFirestoreTypes.modular.DocumentReference<T>,
  data: GeoFirestoreTypes.modular.WithFieldValue<T>,
  customKey?: string
): Promise<void> {
  return nUpdateDoc(reference, encodeDocumentUpdate(data, customKey));
}

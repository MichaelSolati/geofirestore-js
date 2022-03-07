import {addDoc as nAddDoc} from 'firebase/firestore';
import {GeoFirestoreTypes, encodeDocumentAdd} from 'geofirestore-core';

/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @param customKey - The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend (Note that it
 * won't resolve while you're offline).
 */
export function addDoc<T>(
  reference: GeoFirestoreTypes.modular.CollectionReference<T>,
  data: GeoFirestoreTypes.modular.WithFieldValue<T>,
  customKey?: string
): Promise<GeoFirestoreTypes.modular.DocumentReference<T>> {
  return nAddDoc(reference, encodeDocumentAdd(data, customKey));
}

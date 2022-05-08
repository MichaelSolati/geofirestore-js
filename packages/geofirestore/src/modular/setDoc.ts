import {setDoc as nSetDoc} from 'firebase/firestore';
import {GeoFirestoreTypes, encodeDocumentSet} from 'geofirestore-core';

/**
 * Writes to the document referred to by this `DocumentReference`. If the
 * document does not yet exist, it will be created.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @param options - An object to configure the set behavior.
 * Includes custom key for location in document.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export function setDoc<T>(
  reference: GeoFirestoreTypes.modular.DocumentReference<T>,
  data: GeoFirestoreTypes.modular.WithFieldValue<T>,
  options?: GeoFirestoreTypes.SetOptions
): Promise<void> {
  return nSetDoc(reference, encodeDocumentSet(data, options), options);
}

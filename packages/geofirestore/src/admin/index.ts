import {GeoFirestoreTypes} from 'geofirestore-core';
import {GeoFirestore} from './GeoFirestore';

export {GeoCollectionReference} from './GeoCollectionReference';
export {GeoDocumentReference} from './GeoDocumentReference';
export {GeoDocumentSnapshot} from './GeoDocumentSnapshot';
export {GeoFirestore} from './GeoFirestore';
export {GeoQuery} from './GeoQuery';
export {GeoTransaction} from './GeoTransaction';
export {GeoWriteBatch} from './GeoWriteBatch';

export function geofirestore(
  firestore: GeoFirestoreTypes.admin.Firestore
): GeoFirestore {
  return new GeoFirestore(firestore);
}

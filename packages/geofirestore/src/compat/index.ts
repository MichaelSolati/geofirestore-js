import {GeoFirestoreTypes} from 'geofirestore-core';
import {GeoFirestore} from '../admin/GeoFirestore';

export {GeoCollectionReference} from '../admin/GeoCollectionReference';
export {GeoDocumentReference} from '../admin/GeoDocumentReference';
export {GeoDocumentSnapshot} from '../admin/GeoDocumentSnapshot';
export {GeoFirestore} from '../admin/GeoFirestore';
export {GeoQuery} from '../admin/GeoQuery';
export {GeoTransaction} from '../admin/GeoTransaction';
export {GeoWriteBatch} from '../admin/GeoWriteBatch';

export function geofirestore(
  firestore: GeoFirestoreTypes.compat.Firestore
): GeoFirestore {
  return new GeoFirestore(firestore);
}

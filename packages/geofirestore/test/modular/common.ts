import {
  collection,
  connectFirestoreEmulator,
  doc,
  getFirestore,
  GeoPoint,
  writeBatch,
} from 'firebase/firestore';
import {GeoFirestoreTypes, encodeGeoDocument} from 'geofirestore-core';

import {firebaseApp, testCollectionName} from '../common';

export * from '../common';

const _firestore = getFirestore(firebaseApp);
connectFirestoreEmulator(_firestore, 'localhost', 8080);

/*************/
/*  GLOBALS  */
/*************/
export const firestore = _firestore;
export const testCollection = collection(_firestore, testCollectionName);
export const validDocumentData: () => GeoFirestoreTypes.DocumentData[] = () => [
  {coordinates: new GeoPoint(2, 3), count: 0},
  {coordinates: new GeoPoint(50, -7), count: 1},
  {coordinates: new GeoPoint(16, -150), count: 2},
  {coordinates: new GeoPoint(5, 5), count: 3},
  {coordinates: new GeoPoint(67, 55), count: 4},
  {coordinates: new GeoPoint(8, 8), count: 5},
];

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
export function stubDatabase(): Promise<void> {
  const docs = validDocumentData();
  const batch = writeBatch(firestore);
  docs.forEach((item, index) => {
    const insert = doc(testCollection, `loc${index}`);
    batch.set(insert, encodeGeoDocument(item.coordinates, item));
  });
  return batch.commit();
}

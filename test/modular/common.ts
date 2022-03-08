import {
  collection,
  connectFirestoreEmulator,
  getFirestore,
  GeoPoint,
} from 'firebase/firestore';
import {GeoFirestoreTypes} from 'geofirestore-core';

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

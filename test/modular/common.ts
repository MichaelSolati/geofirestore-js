import {initializeApp} from 'firebase/app';
import {getFirestore, collection, GeoPoint} from 'firebase/firestore';
import {GeoFirestoreTypes} from 'geofirestore-core';

import {firebaseOptions, testCollectionName} from '../common';
export {
  afterEachHelper,
  beforeEachHelper,
  invalidGeoFirestoreDocuments,
  invalidObjects,
  wait,
} from '../common';

const firebaseApp = initializeApp(firebaseOptions);

export const firestore = getFirestore(firebaseApp);
export const testCollection = collection(firestore, testCollectionName);
export const validDocumentData: () => GeoFirestoreTypes.DocumentData[] = () => [
  {coordinates: new GeoPoint(2, 3), count: 0},
  {coordinates: new GeoPoint(50, -7), count: 1},
  {coordinates: new GeoPoint(16, -150), count: 2},
  {coordinates: new GeoPoint(5, 5), count: 3},
  {coordinates: new GeoPoint(67, 55), count: 4},
  {coordinates: new GeoPoint(8, 8), count: 5},
];

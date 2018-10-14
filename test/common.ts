import * as chai from 'chai';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { GeoCollectionReference, GeoFirestore, GeoFirestoreTypes } from '../src';

/*************/
/*  GLOBALS  */
/*************/
const expect = chai.expect;
// Define dummy data for database
export const dummyData = [
  { key: 'loc1', coordinates: new firebase.firestore.GeoPoint(0.2, 0.3), count: 1 },
  { key: 'loc2', coordinates: new firebase.firestore.GeoPoint(5, -0.7), count: 2 },
  { key: 'loc3', coordinates: new firebase.firestore.GeoPoint(1.6, -15), count: 3 },
  { key: 'loc4', coordinates: new firebase.firestore.GeoPoint(.5, .5), count: 1 },
  { key: 'loc5', coordinates: new firebase.firestore.GeoPoint(6.7, 5.5), count: 2 }
];
// Define examples of valid and invalid parameters
export const invalidFirestores = [null, undefined, NaN, true, false, [], 0, 5, '', 'a', ['hi', 1]];
export const invalidGeoFirestoreDocuments = [
  { d: null, g: '6gydkcbqwf', l: new firebase.firestore.GeoPoint(-23.5, -46.9) },
  { d: { coordinates: new firebase.firestore.GeoPoint(-73.5, 153) }, g: false, l: new firebase.firestore.GeoPoint(-73.5, 153) },
  { d: { coordinates: new firebase.firestore.GeoPoint(52.3, 7.1) }, g: 'u1m198fj9f', l: [52.3, 7.1] }
];
export const invalidGeohashes = ['', 'aaa', 1, true, false, [], [1], {}, { a: 1 }, null, undefined, NaN];
export const invalidLocations = [
  { latitude: -91, longitude: 0 }, { latitude: 91, longitude: 0 }, { latitude: 0, longitude: 181 }, { latitude: 0, longitude: -181 },
  { latitude: [0, 0], longitude: 0 }, { latitude: 'a', longitude: 0 }, { latitude: 0, longitude: 'a' }, { latitude: 'a', longitude: 'a' },
  { latitude: NaN, longitude: 0 }, { latitude: 0, longitude: NaN }, { latitude: undefined, longitude: NaN },
  { latitude: null, longitude: 0 }, { latitude: null, longitude: null }, { latitude: 0, longitude: undefined },
  { latitude: undefined, longitude: undefined }, '', 'a', true, false, [], [1], {}, { a: 1 }, null, undefined, NaN
];
export const invalidQueryCriterias = [
  {}, { random: 100 }, { center: { latitude: 91, longitude: 2 }, radius: 1000, random: 'a' },
  { center: { latitude: 91, longitude: 2 }, radius: 1000 }, { center: { latitude: 1, longitude: -181 }, radius: 1000 },
  { center: { latitude: 'a', longitude: 2 }, radius: 1000 }, { center: { latitude: 1, longitude: [1, 2] }, radius: 1000 },
  { center: new firebase.firestore.GeoPoint(0, 0), radius: -1 }, { center: { latitude: null, longitude: 2 }, radius: 1000 },
  { center: { latitude: 1, longitude: undefined }, radius: 1000 }, { center: { latitude: NaN, longitude: 0 }, radius: 1000 },
  { center: new firebase.firestore.GeoPoint(1, 2), radius: -10 }, { center: new firebase.firestore.GeoPoint(1, 2), radius: 'text' },
  { center: new firebase.firestore.GeoPoint(1, 2), radius: [1, 2] }, { center: new firebase.firestore.GeoPoint(1, 2), radius: null }, true,
  false, undefined, NaN, [], 'a', 1, { center: new firebase.firestore.GeoPoint(1, 2), radius: 2, query: false },
  { center: new firebase.firestore.GeoPoint(1, 2), radius: 2, query: 23 }
];
// export const invalidObjects = [false, true, 'pie', 3, null, undefined, NaN];
export const testCollectionName = 'tests';
export const validGeoFirestoreDocuments: GeoFirestoreTypes.Document[] = [
  { d: { coordinates: new firebase.firestore.GeoPoint(-23.5, -46.9) }, g: '6gydkcbqwf', l: new firebase.firestore.GeoPoint(-23.5, -46.9) },
  { d: { coordinates: new firebase.firestore.GeoPoint(-73.5, 153) }, g: 'r7hg99g0yk', l: new firebase.firestore.GeoPoint(-73.5, 153) },
  { d: { coordinates: new firebase.firestore.GeoPoint(52.3, 7.1) }, g: 'u1m198fj9f', l: new firebase.firestore.GeoPoint(52.3, 7.1) }
];
export const validGeohashes = ['4', 'd62dtu', '000000000000'];
export const validLocations = [
  new firebase.firestore.GeoPoint(0, 0), new firebase.firestore.GeoPoint(-90, 180),
  new firebase.firestore.GeoPoint(90, -180), new firebase.firestore.GeoPoint(23, 74),
  new firebase.firestore.GeoPoint(47.235124363, 127.2379654226)
];
export const validQueryCriterias: GeoFirestoreTypes.QueryCriteria[] = [
  { center: new firebase.firestore.GeoPoint(0, 0), radius: 1000 }, { center: new firebase.firestore.GeoPoint(1, -180), radius: 1.78 },
  { center: new firebase.firestore.GeoPoint(22.22, -107.77), radius: 0 }, { center: new firebase.firestore.GeoPoint(0, 0) },
  { center: new firebase.firestore.GeoPoint(1, -180) }, { center: new firebase.firestore.GeoPoint(22.22, -107.77) },
  { center: new firebase.firestore.GeoPoint(1, 2), radius: 2 }, { radius: 1000 }, { radius: 1.78 }, { radius: 0 }
];

// Create global constiables to hold the Firebasestore and GeoFirestore constiables
export let firestoreRef: firebase.firestore.Firestore;
export let collectionRef: firebase.firestore.CollectionReference;

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyDFnedGL4qr_jenIpWYpbvot8s7Vuay_88',
  databaseURL: 'https://geofirestore.firebaseio.com',
  projectId: 'geofirestore',
});
firebase.firestore().settings({ timestampsInSnapshots: true });

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
/* Helper functions which runs before each Jasmine test has started */
export function beforeEachHelper(done): void {
  // Create a new Firebase database ref at a random node
  firestoreRef = firebase.firestore();
  collectionRef = firestoreRef.collection('tests');
  done();
}

/* Helper functions which runs after each Jasmine test has completed */
export function afterEachHelper(done): void {
  deleteCollection().then(() => {
    // Wait for 50 milliseconds after each test to give enough time for old query events to expire
    return wait(50);
  }).then(done);
}

/* Returns a promise which is fulfilled after the inputted number of milliseconds pass */
export function wait(milliseconds): Promise<void> {
  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      window.clearTimeout(timeout);
      resolve();
    }, milliseconds);
  });
}

/* Used to purge Firestore collection. Used by afterEachHelperFirestore. */
function deleteCollection(): Promise<any> {
  return new Promise((resolve, reject) => deleteQueryBatch(collectionRef.limit(500), resolve, reject));
}

/* Actually purges Firestore collection recursively through batch function. */
function deleteQueryBatch(query: firebase.firestore.Query, resolve: Function, reject: Function): void {
  query.get().then((snapshot) => {
    // When there are no documents left, we are done
    if (snapshot.size === 0) { return 0; }

    // Delete documents in a batch
    const batch = firestoreRef.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));

    return batch.commit().then(() => snapshot.size);
  }).then((numDeleted) => {
    if (numDeleted === 0) {
      resolve();
      return;
    }
    process.nextTick(() => deleteQueryBatch(query, resolve, reject));
  }).catch(err => reject(err));
}

export function stubDatabase(): Promise<any> {
  const geofirestore = new GeoFirestore(firestoreRef);
  const batch = geofirestore.batch();
  const collection = new GeoCollectionReference(collectionRef);
  dummyData.forEach(item => {
    const insert = collection.doc(item.key);
    batch.set(insert, item);
  });
  return batch.commit();
}

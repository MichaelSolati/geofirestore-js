import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {GeoFirestoreTypes} from '../src/definitions';
import {encodeDocumentAdd} from '../src/api/encode';

/*************/
/*  GLOBALS  */
/*************/
// Create global constiables to hold the Firebasestore and GeoFirestore constiables
export let firestore: firebase.firestore.Firestore;
export let collection: firebase.firestore.CollectionReference;
const testCollectionName = 'geofirestore-core-tests';

export const invalidDocumentData: () => any[] = () => [
  null,
  undefined,
  NaN,
  true,
  false,
  [],
  0,
  5,
  '',
  'a',
  ['hi', 1],
];
export const invalidLocations: () => any[] = () => [
  {latitude: -91, longitude: 0},
  {latitude: 91, longitude: 0},
  {latitude: 0, longitude: 181},
  {latitude: 0, longitude: -181},
  {latitude: [0, 0], longitude: 0},
  {latitude: 'a', longitude: 0},
  {latitude: 0, longitude: 'a'},
  {latitude: 'a', longitude: 'a'},
  {latitude: NaN, longitude: 0},
  {latitude: 0, longitude: NaN},
  {latitude: undefined, longitude: NaN},
  {latitude: null, longitude: 0},
  {latitude: null, longitude: null},
  {latitude: 0, longitude: undefined},
  {latitude: undefined, longitude: undefined},
  '',
  'a',
  true,
  false,
  [],
  [1],
  {},
  {a: 1},
  null,
  undefined,
  NaN,
];
export const invalidQueryCriterias: () => any[] = () => [
  {},
  {random: 100},
  {center: {latitude: 91, longitude: 2}, radius: 1000, random: 'a'},
  {center: {latitude: 91, longitude: 2}, radius: 1000},
  {center: {latitude: 1, longitude: -181}, radius: 1000},
  {center: {latitude: 'a', longitude: 2}, radius: 1000},
  {center: {latitude: 1, longitude: [1, 2]}, radius: 1000},
  {center: new firebase.firestore.GeoPoint(0, 0), radius: -1},
  {center: {latitude: null, longitude: 2}, radius: 1000},
  {center: {latitude: 1, longitude: undefined}, radius: 1000},
  {center: {latitude: NaN, longitude: 0}, radius: 1000},
  {center: new firebase.firestore.GeoPoint(1, 2), radius: -10},
  {center: new firebase.firestore.GeoPoint(1, 2), radius: 'text'},
  {center: new firebase.firestore.GeoPoint(1, 2), radius: [1, 2]},
  {center: new firebase.firestore.GeoPoint(1, 2), radius: null},
  true,
  false,
  undefined,
  NaN,
  [],
  'a',
  1,
  {center: new firebase.firestore.GeoPoint(1, 2), radius: 2, query: false},
  {center: new firebase.firestore.GeoPoint(1, 2), radius: 2, query: 23},
];
// Define dummy data for database
export const validDocumentData: () => GeoFirestoreTypes.DocumentData[] = () => [
  {coordinates: new firebase.firestore.GeoPoint(2, 3), count: 0},
  {coordinates: new firebase.firestore.GeoPoint(50, -7), count: 1},
  {coordinates: new firebase.firestore.GeoPoint(16, -150), count: 2},
  {coordinates: new firebase.firestore.GeoPoint(5, 5), count: 3},
  {coordinates: new firebase.firestore.GeoPoint(67, 55), count: 4},
  {coordinates: new firebase.firestore.GeoPoint(8, 8), count: 5},
];
export const validGeoDocumentData: () => GeoFirestoreTypes.GeoDocumentData[] =
  () => validDocumentData().map(e => encodeDocumentAdd(e));
export const validLocations: () => firebase.firestore.GeoPoint[] = () => [
  new firebase.firestore.GeoPoint(0, 0),
  new firebase.firestore.GeoPoint(-90, 180),
  new firebase.firestore.GeoPoint(90, -180),
  new firebase.firestore.GeoPoint(23, 74),
  new firebase.firestore.GeoPoint(47.235124363, 127.2379654226),
];
export const validQueryCriterias: () => GeoFirestoreTypes.QueryCriteria[] =
  () => [
    {center: new firebase.firestore.GeoPoint(0, 0), radius: 1000},
    {center: new firebase.firestore.GeoPoint(1, -180), radius: 1.78},
    {center: new firebase.firestore.GeoPoint(22.22, -107.77), radius: 0},
    {center: new firebase.firestore.GeoPoint(0, 0)},
    {center: new firebase.firestore.GeoPoint(1, -180)},
    {center: new firebase.firestore.GeoPoint(22.22, -107.77)},
    {center: new firebase.firestore.GeoPoint(1, 2), radius: 2},
    {center: new firebase.firestore.GeoPoint(1, 2), radius: 2, limit: 1},
    {radius: 2, limit: 1},
    {center: new firebase.firestore.GeoPoint(1, 2), limit: 1},
  ];
export const validSetOptions: () => GeoFirestoreTypes.SetOptions = () => ({
  merge: true,
  customKey: 'foobar',
  mergeFields: ['a', 'b'],
});
// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyDFnedGL4qr_jenIpWYpbvot8s7Vuay_88',
  databaseURL: 'https://geofirestore.firebaseio.com',
  projectId: 'geofirestore',
});

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
/* Helper functions which runs before each Jasmine test has started */
export function beforeEachHelper(done: any): void {
  if (firestore) {
    firestore.terminate();
  }
  firestore = firebase.firestore();
  firestore.useEmulator('localhost', 8080);
  collection = firestore.collection(testCollectionName);
  done();
}

/* Helper functions which runs after each Jasmine test has completed */
export function afterEachHelper(done: any): void {
  deleteCollection()
    .then(() => wait(50))
    .then(done);
}

/* Used to purge Firestore collection. Used by afterEachHelperFirestore. */
function deleteCollection(): Promise<any> {
  /* Actually purges Firestore collection recursively through batch function. */
  function deleteQueryBatch(
    query: firebase.firestore.Query,
    resolve: (value: any) => void,
    reject: (err: Error) => void
  ): void {
    query
      .get()
      .then(snapshot => {
        if (snapshot.size === 0) return 0;
        // Delete documents in a batch
        const batch = firestore.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        return batch.commit().then(() => snapshot.size);
      })
      .then(numDeleted => {
        if (numDeleted === 0) {
          resolve(null);
        } else {
          process.nextTick(() => deleteQueryBatch(query, resolve, reject));
        }
      })
      .catch(err => reject(err));
  }

  return new Promise((resolve, reject) =>
    deleteQueryBatch(collection.limit(500), resolve, reject)
  );
}

export function stubCollection(
  docs: {[key: string]: any}[] = validDocumentData()
): Promise<any> {
  const batch = firestore.batch();
  docs.forEach(item => {
    const key = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 8);

    item.key = item.key || key;
    const insert = collection.doc(item.key);
    batch.set(insert, encodeDocumentAdd(item));
  });
  return batch.commit();
}

/* Returns a promise which is fulfilled after the inputted number of milliseconds pass */
export function wait(milliseconds = 100): Promise<void> {
  return new Promise(resolve => {
    const timeout = window.setTimeout(() => {
      window.clearTimeout(timeout);
      resolve();
    }, milliseconds);
  });
}

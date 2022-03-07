import * as chai from 'chai';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {encodeDocumentAdd, GeoFirestoreTypes} from 'geofirestore-core';
import {distance} from 'geokit';
import axios from 'axios';

import {GeoCollectionReference, GeoFirestore} from '../src/admin';

/*************/
/*  GLOBALS  */
/*************/
const expect = chai.expect;
// Define dummy data for database
export const validDocumentData: () => GeoFirestoreTypes.DocumentData[] = () => [
  {coordinates: new firebase.firestore.GeoPoint(2, 3), count: 0},
  {coordinates: new firebase.firestore.GeoPoint(50, -7), count: 1},
  {coordinates: new firebase.firestore.GeoPoint(16, -150), count: 2},
  {coordinates: new firebase.firestore.GeoPoint(5, 5), count: 3},
  {coordinates: new firebase.firestore.GeoPoint(67, 55), count: 4},
  {coordinates: new firebase.firestore.GeoPoint(8, 8), count: 5},
];
export const validGeoDocumentData = () =>
  validDocumentData().map(e => encodeDocumentAdd(e));
// Define dummy setOptions to sanitize
export const dummySetOptions: GeoFirestoreTypes.SetOptions = {
  merge: true,
  customKey: 'foobar',
  mergeFields: ['a', 'b'],
};
// Define examples of valid and invalid parameters
export const invalidFirestores: any[] = [
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
export const invalidGeoFirestoreDocuments: any[] = [
  {g: 'a'},
  {g: false},
  {g: 1},
  {g: {}},
  {},
  null,
  undefined,
  NaN,
];
export const invalidGeohashes: any[] = [
  '',
  'aaa',
  1,
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
export const invalidLocations: any[] = [
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
export const invalidQueryCriterias: any[] = [
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
export const invalidObjects: any[] = [
  false,
  true,
  'pie',
  3,
  null,
  undefined,
  NaN,
];
export const testCollectionName = 'geofirestore-tests';
const projectId = 'geofirestore';
export const validGeohashes: string[] = ['4', 'd62dtu', '000000000000'];
export const validLocations: firebase.firestore.GeoPoint[] = [
  new firebase.firestore.GeoPoint(0, 0),
  new firebase.firestore.GeoPoint(-90, 180),
  new firebase.firestore.GeoPoint(90, -180),
  new firebase.firestore.GeoPoint(23, 74),
  new firebase.firestore.GeoPoint(47.235124363, 127.2379654226),
];
export const validQueryCriterias: GeoFirestoreTypes.QueryCriteria[] = [
  {center: new firebase.firestore.GeoPoint(0, 0), radius: 1000},
  {center: new firebase.firestore.GeoPoint(1, -180), radius: 1.78},
  {center: new firebase.firestore.GeoPoint(22.22, -107.77), radius: 0},
  {center: new firebase.firestore.GeoPoint(0, 0)},
  {center: new firebase.firestore.GeoPoint(1, -180)},
  {center: new firebase.firestore.GeoPoint(22.22, -107.77)},
  {center: new firebase.firestore.GeoPoint(1, 2), radius: 2},
  {radius: 1000},
  {radius: 1.78},
  {radius: 0},
];

// Create global constiables to hold the Firebasestore and GeoFirestore constiables
export let firestore: firebase.firestore.Firestore;
export let collection: firebase.firestore.CollectionReference;
export let geofirestore: GeoFirestore;
export let geocollection: GeoCollectionReference;
export const firebaseOptions = {
  apiKey: 'AIzaSyDFnedGL4qr_jenIpWYpbvot8s7Vuay_88',
  databaseURL: 'https://geofirestore.firebaseio.com',
  projectId,
};

// Initialize Firebase
firebase.initializeApp(firebaseOptions);

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
  geofirestore = new GeoFirestore(firestore);
  geocollection = new GeoCollectionReference(collection);
  done();
}

/* Helper functions which runs after each Jasmine test has completed */
export function afterEachHelper(done: any): void {
  axios
    .delete(
      `http://${process.env.FIREBASE_FIRESTORE_EMULATOR_ADDRESS}/emulator/v1/projects/${projectId}/databases/(default)/documents`
    )
    .then(() => done());
}

/* Helper function designed to create docs within a certain range of coordinates */
export function generateDocs(
  total = 100,
  center = new firebase.firestore.GeoPoint(0, 0),
  maxLat = 0.5,
  minLat = -0.5,
  maxLng = 0.5,
  minLng = -0.5
): Array<{coordinates: firebase.firestore.GeoPoint; distance: number}> {
  return new Array(total).fill(0).map(() => {
    const lat = Math.random() * (maxLat - minLat + 1) + minLat;
    const lng = Math.random() * (maxLng - minLng + 1) + minLng;
    const coordinates = new firebase.firestore.GeoPoint(lat, lng);
    return {
      coordinates,
      distance: calculateDistance(coordinates, center),
    };
  });
}

/* Common error handler for use in .catch() statements of promises. This will
 * cause the test to fail, outputting the details of the exception. Otherwise, tests
 * tend to fail due to the Jasmine ASYNC timeout and provide no details of what actually
 * went wrong.
 **/
export function failTestOnCaughtError(error: any) {
  expect(error).to.throw();
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

export function stubDatabase(
  docs: Array<{[key: string]: any}> = validDocumentData()
): Promise<any> {
  const geofirestore = new GeoFirestore(firestore);
  const batch = geofirestore.batch();
  const geocollection = new GeoCollectionReference(collection);
  docs.forEach((item, index) => {
    const insert = geocollection.doc(`loc${index}`);
    batch.set(insert, item);
  });
  return batch.commit();
}

/**
 * Function which validates GeoPoints then calculates the distance, in kilometers, between them.
 *
 * @param location1 The GeoPoint of the first location.
 * @param location2 The GeoPoint of the second location.
 * @return The distance, in kilometers, between the inputted locations.
 */
export function calculateDistance(
  location1:
    | GeoFirestoreTypes.admin.GeoPoint
    | GeoFirestoreTypes.compat.GeoPoint,
  location2:
    | GeoFirestoreTypes.admin.GeoPoint
    | GeoFirestoreTypes.compat.GeoPoint
): number {
  return distance(
    {lat: location1.latitude, lng: location1.longitude},
    {lat: location2.latitude, lng: location2.longitude}
  );
}

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {encodeDocumentAdd, GeoFirestoreTypes} from 'geofirestore-core';
import {distance} from 'geokit';

import {GeoCollectionReference, GeoFirestore} from '../../src/admin';
import {testCollectionName} from '../common';

export * from '../common';

/*************/
/*  GLOBALS  */
/*************/
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

const _firestore = firebase.firestore();
_firestore.useEmulator('localhost', 8080);
export const firestore = _firestore;
export const collection = firestore.collection(testCollectionName);
export const geofirestore = new GeoFirestore(firestore);
export const geocollection = new GeoCollectionReference(collection);

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
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

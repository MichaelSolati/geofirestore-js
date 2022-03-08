import firebase from 'firebase/compat/app';
import axios from 'axios';
import {expect} from 'chai';

/*************/
/*  GLOBALS  */
/*************/
export const firebaseOptions = {
  apiKey: 'AIzaSyDFnedGL4qr_jenIpWYpbvot8s7Vuay_88',
  databaseURL: 'https://geofirestore.firebaseio.com',
  projectId: 'geofirestore',
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseOptions);
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

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
/* Common error handler for use in .catch() statements of promises. This will
 * cause the test to fail, outputting the details of the exception. Otherwise, tests
 * tend to fail due to the Jasmine ASYNC timeout and provide no details of what actually
 * went wrong.
 **/
export function failTestOnCaughtError(error: any) {
  expect(error).to.throw();
}

export function purge(done: () => void): void {
  axios
    .delete(
      `http://${process.env.FIREBASE_FIRESTORE_EMULATOR_ADDRESS}/emulator/v1/projects/` +
        `${firebaseOptions.projectId}/databases/(default)/documents`
    )
    .then(() => done());
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

import * as firebase from 'firebase';

export interface GeoFirestoreObj {
  g: string;
  l: firebase.firestore.GeoPoint;
  d: any;
}

import * as firebase from 'firebase';

export interface GeoFirestoreObj {
  geohash: string;
  location: firebase.firestore.GeoPoint;
  document: any;
}

import * as firebase from 'firebase/app';
import 'firebase/firestore';

export interface GeoFirestoreObj {
  g: string;
  l: firebase.firestore.GeoPoint;
  d: any;
}

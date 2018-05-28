import { firestore } from 'firebase/app';

export interface GeoFirestoreObj {
  g: string;
  l: firestore.GeoPoint;
  d: any;
}

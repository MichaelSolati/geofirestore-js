import { firestore } from './firestore';

export interface GeoFirestoreObj {
  g: string;
  l: firestore.GeoPoint | firestore.cloud.GeoPoint;
  d: any;
}

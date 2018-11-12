import { firestore } from './firestore';

export interface GeoFirestoreObj {
  g: string;
  l: firestore.web.GeoPoint | firestore.cloud.GeoPoint;
  d: any;
}

import { DocumentData } from './documentData';
import { FirestoreWeb, FirestoreCloud } from './firestore';

export interface GeoDocument {
  g: string;
  l: FirestoreWeb.GeoPoint | FirestoreCloud.GeoPoint;
  d: DocumentData;
}

import { DocumentData } from './documentData';
import { GeoFirestoreTypes } from './firestore';

export interface GeoDocument {
  g: string;
  l: GeoFirestoreTypes.web.GeoPoint | GeoFirestoreTypes.cloud.GeoPoint;
  d: DocumentData;
}

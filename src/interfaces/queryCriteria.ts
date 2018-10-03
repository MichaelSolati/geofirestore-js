import { FirestoreCloud, FirestoreWeb } from './firestore';

export interface GeoQueryCriteria {
  center?: FirestoreCloud.GeoPoint | FirestoreWeb.GeoPoint;
  radius?: number;
}
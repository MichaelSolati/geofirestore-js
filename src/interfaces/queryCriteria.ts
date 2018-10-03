import { GeoFirestoreTypes } from './firestore';

export interface GeoQueryCriteria {
  center?: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint;
  radius?: number;
}
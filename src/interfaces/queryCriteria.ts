import { firestore } from './firestore';

export interface QueryCriteria {
  center?: firestore.GeoPoint;
  radius?: number;
}
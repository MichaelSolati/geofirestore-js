import { firestore } from 'firebase/app';

export interface QueryCriteria {
  center?: firestore.GeoPoint;
  radius?: number;
}
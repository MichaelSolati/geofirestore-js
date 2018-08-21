import { firestore } from './firestore';

export interface QueryCriteria {
  center?: firestore.GeoPoint | firestore.cloud.GeoPoint;
  radius?: number;
  query?: (ref: firestore.CollectionReference | firestore.cloud.CollectionReference) => firestore.Query | firestore.cloud.Query;
}
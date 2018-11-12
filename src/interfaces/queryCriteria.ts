import { firestore } from './firestore';

export interface QueryCriteria {
  center?: firestore.web.GeoPoint | firestore.cloud.GeoPoint;
  radius?: number;
  query?: (ref: firestore.web.CollectionReference | firestore.cloud.CollectionReference) => firestore.web.Query | firestore.cloud.Query;
}
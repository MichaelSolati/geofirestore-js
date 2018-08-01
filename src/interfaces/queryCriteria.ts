import { firestore } from './firestore';

export interface QueryCriteria {
  center?: firestore.GeoPoint;
  radius?: number;
  query?: (ref: firestore.CollectionReference) => firestore.Query;
}
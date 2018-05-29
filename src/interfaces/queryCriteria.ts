import * as firebase from 'firebase';

export interface QueryCriteria {
  center?: firebase.firestore.GeoPoint;
  radius?: number;
}
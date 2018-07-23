import * as firebase from 'firebase/app';
import 'firebase/firestore';

export interface QueryCriteria {
  center?: firebase.firestore.GeoPoint;
  radius?: number;
}
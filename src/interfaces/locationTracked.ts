import * as firebase from 'firebase/app';
import 'firebase/firestore';

export interface LocationTracked {
  distanceFromCenter: number;
  document: any;
  geohash: string;
  isInQuery: boolean;
  location: firebase.firestore.GeoPoint;
}
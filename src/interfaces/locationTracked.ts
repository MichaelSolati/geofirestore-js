import * as firebase from 'firebase';

export interface LocationTracked {
  distanceFromCenter: number;
  document?: any;
  geohash: string;
  isInQuery: boolean;
  location: firebase.firestore.GeoPoint;
}
import { firestore } from './firestore';

export interface LocationTracked {
  distanceFromCenter: number;
  document: any;
  geohash: string;
  isInQuery: boolean;
  location: firestore.GeoPoint;
}
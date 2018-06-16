export interface GeoFirestoreQueryState {
  active: boolean;
  childCallback: () => void;
  valueCallback: () => void;
}
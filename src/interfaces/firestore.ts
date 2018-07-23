import * as types from '@firebase/firestore-types';

export namespace firestore {
  export interface CollectionReference extends types.CollectionReference { }
  export interface DocumentChange extends types.DocumentChange { }
  export interface DocumentReference extends types.DocumentReference { }
  export interface DocumentSnapshot extends types.DocumentSnapshot { }
  export interface GeoPoint extends types.GeoPoint { }
  export interface Query extends types.Query { }
  export interface QuerySnapshot extends types.QuerySnapshot { }
  export interface WriteBatch extends types.WriteBatch { }
}
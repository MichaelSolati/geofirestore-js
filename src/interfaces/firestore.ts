import * as FirestoreTypes from '@firebase/firestore-types';
import '@google-cloud/firestore/types/firestore';
import '@types/node';

export namespace FirestoreWeb {
  export interface CollectionReference extends FirestoreTypes.CollectionReference { }
  export interface DocumentChange extends FirestoreTypes.DocumentChange { }
  export interface DocumentData extends FirestoreTypes.DocumentData { }
  export interface DocumentReference extends FirestoreTypes.DocumentReference { }
  export interface DocumentSnapshot extends FirestoreTypes.DocumentSnapshot { }
  export interface Firestore extends FirestoreTypes.FirebaseFirestore { }
  export interface FieldPath extends FirestoreTypes.FieldPath { }
  export interface GetOptions extends FirestoreTypes.GetOptions { }
  export interface GeoPoint extends FirestoreTypes.GeoPoint { }
  export type OrderByDirection = FirestoreTypes.OrderByDirection;
  export interface Query extends FirestoreTypes.Query { }
  export interface QuerySnapshot extends FirestoreTypes.QuerySnapshot { }
  export interface QueryDocumentSnapshot extends FirestoreTypes.QueryDocumentSnapshot { }
  export interface SnapshotListenOptions extends FirestoreTypes.SnapshotListenOptions { }
  export type WhereFilterOp = FirestoreTypes.WhereFilterOp;
  export interface WriteBatch extends FirestoreTypes.WriteBatch { }
}

export namespace FirestoreCloud {
  export interface CollectionReference extends FirebaseFirestore.CollectionReference { }
  export interface DocumentChange extends FirebaseFirestore.DocumentChange { }
  export interface DocumentData extends FirebaseFirestore.DocumentData { }
  export interface DocumentReference extends FirebaseFirestore.DocumentReference { }
  export interface DocumentSnapshot extends FirebaseFirestore.DocumentSnapshot { }
  export interface Firestore extends FirebaseFirestore.Firestore { }
  export interface FieldPath extends FirebaseFirestore.FieldPath { }
  export interface GeoPoint extends FirebaseFirestore.GeoPoint { }
  export type OrderByDirection = FirebaseFirestore.OrderByDirection;
  export interface Query extends FirebaseFirestore.Query { }
  export interface QuerySnapshot extends FirebaseFirestore.QuerySnapshot { }
  export interface QueryDocumentSnapshot extends FirebaseFirestore.QueryDocumentSnapshot { }
  export type WhereFilterOp = FirebaseFirestore.WhereFilterOp;
  export interface WriteBatch extends FirebaseFirestore.WriteBatch { }
}
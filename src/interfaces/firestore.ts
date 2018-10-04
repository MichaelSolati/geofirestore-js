import * as FirestoreTypes from '@firebase/firestore-types';
import '@google-cloud/firestore/types/firestore';
import '@types/node';

import { GeoDocument as IGeoDocument } from './document';
import { GeoDocumentChange as IGeoDocumentChange } from './documentChange';
import { DocumentData as IDocumentData } from './documentData';
import { GeoQueryCriteria as IGeoQueryCriteria } from './queryCriteria';
import { GeoQueryDocumentSnapshot as IGeoQueryDocumentSnapshot } from './queryDocumentSnapshot';

export namespace GeoFirestoreTypes {
  export interface Document extends IGeoDocument { }
  export interface DocumentData extends IDocumentData { }
  export interface DocumentChange extends IGeoDocumentChange { }
  export interface QueryCriteria extends IGeoQueryCriteria { }
  export interface QueryDocumentSnapshot extends IGeoQueryDocumentSnapshot { }
  export interface UpdateData extends IDocumentData { }
  export namespace web {
    export interface CollectionReference extends FirestoreTypes.CollectionReference { }
    export interface DocumentChange extends FirestoreTypes.DocumentChange { }
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
    export interface SetOptions extends FirestoreTypes.SetOptions {
      customKey?: string;
    }
    export type WhereFilterOp = FirestoreTypes.WhereFilterOp;
    export interface WriteBatch extends FirestoreTypes.WriteBatch { }
  }
  export namespace cloud {
    export interface CollectionReference extends FirebaseFirestore.CollectionReference { }
    export interface DocumentChange extends FirebaseFirestore.DocumentChange { }
    export interface DocumentReference extends FirebaseFirestore.DocumentReference { }
    export interface DocumentSnapshot extends FirebaseFirestore.DocumentSnapshot { }
    export interface Firestore extends FirebaseFirestore.Firestore { }
    export interface FieldPath extends FirebaseFirestore.FieldPath { }
    export interface GeoPoint extends FirebaseFirestore.GeoPoint { }
    export type OrderByDirection = FirebaseFirestore.OrderByDirection;
    export interface Query extends FirebaseFirestore.Query { }
    export interface QuerySnapshot extends FirebaseFirestore.QuerySnapshot { }
    export interface QueryDocumentSnapshot extends FirebaseFirestore.QueryDocumentSnapshot { }
    export interface SetOptions extends FirebaseFirestore.SetOptions {
      customKey?: string;
    }
    export type WhereFilterOp = FirebaseFirestore.WhereFilterOp;
    export interface WriteBatch extends FirebaseFirestore.WriteBatch { }
  }
}
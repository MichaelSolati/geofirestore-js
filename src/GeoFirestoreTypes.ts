import * as FirestoreTypes from '@firebase/firestore-types';
import '@google-cloud/firestore/types/firestore';
import '@types/node';

export namespace GeoFirestoreTypes {
  export interface Document {
    g: string;
    l: web.GeoPoint | cloud.GeoPoint;
    d: DocumentData;
  }
  export type DocumentData = { [field: string]: any } | undefined;
  export interface DocumentChange {
    doc: DocumentData;
    newIndex: number;
    oldIndex: number;
    type: any;
  }
  export interface QueryCriteria {
    center?: cloud.GeoPoint | web.GeoPoint;
    radius?: number;
  }
  export interface QueryDocumentSnapshot {
    exists: boolean;
    id: string;
    data: DocumentData | any;
    distance: number;
  }
  export interface SetOptions {
    customKey?: string;
    merge?: boolean;
    mergeFields?: Array<string | cloud.FieldPath | web.FieldPath>;
  }
  export type UpdateData = DocumentData;
  export type WhereFilterOp = '<' | '<=' | '==' | '>=' | '>' | 'array-contains';
  export namespace web {
    export interface CollectionReference extends FirestoreTypes.CollectionReference { }
    export interface DocumentChange extends FirestoreTypes.DocumentChange { }
    export interface DocumentReference extends FirestoreTypes.DocumentReference { }
    export interface DocumentSnapshot extends FirestoreTypes.DocumentSnapshot { }
    export interface Firestore extends FirestoreTypes.FirebaseFirestore { }
    export interface FieldPath extends FirestoreTypes.FieldPath { }
    export interface GetOptions extends FirestoreTypes.GetOptions { }
    export interface GeoPoint extends FirestoreTypes.GeoPoint { }
    export interface Query extends FirestoreTypes.Query { }
    export interface QuerySnapshot extends FirestoreTypes.QuerySnapshot { }
    export interface QueryDocumentSnapshot extends FirestoreTypes.QueryDocumentSnapshot { }
    export interface SnapshotOptions extends FirestoreTypes.SnapshotOptions { }
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
    export interface Query extends FirebaseFirestore.Query { }
    export interface QuerySnapshot extends FirebaseFirestore.QuerySnapshot { }
    export interface QueryDocumentSnapshot extends FirebaseFirestore.QueryDocumentSnapshot { }
    export interface WriteBatch extends FirebaseFirestore.WriteBatch { }
  }
}
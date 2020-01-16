/* tslint:disable:no-import-side-effect no-namespace no-shadowed-variable */
import * as cloudfirestore from '@google-cloud/firestore';
import { firestore as webfirestore } from 'firebase/app';
import '@types/node';

export namespace GeoFirestoreTypes {
  export interface Document {
    g: string;
    l: web.GeoPoint | cloud.GeoPoint;
    d: DocumentData;
  }
  export type DocumentData = {  [field: string]: any; coordinates?: cloud.GeoPoint | web.GeoPoint; } | undefined;
  export interface DocumentChange {
    doc: QueryDocumentSnapshot;
    newIndex: number;
    oldIndex: number;
    type: 'added' | 'modified' | 'removed';
  }
  export interface QueryCriteria {
    center?: cloud.GeoPoint | web.GeoPoint;
    radius?: number;
    limit?: number;
  }
  export interface QueryDocumentSnapshot {
    exists: boolean;
    id: string;
    data: () => DocumentData | any;
    distance: number;
  }
  export interface SetOptions {
    customKey?: string;
    merge?: boolean;
    mergeFields?: Array<string | cloud.FieldPath | web.FieldPath>;
  }
  export type SnapshotOptions = webfirestore.SnapshotOptions;
  export interface UpdateData { [fieldPath: string]: any; coordinates?: cloud.GeoPoint | web.GeoPoint; }
  export type WhereFilterOp =
    | '<'
    | '<='
    | '=='
    | '>='
    | '>'
    | 'array-contains'
    | 'in'
    | 'array-contains-any';
  export namespace web {
    export type CollectionReference = webfirestore.CollectionReference;
    export type DocumentChange = webfirestore.DocumentChange;
    export type DocumentReference = webfirestore.DocumentReference;
    export type DocumentSnapshot = webfirestore.DocumentSnapshot;
    export type Firestore = webfirestore.Firestore;
    export type FieldPath = webfirestore.FieldPath;
    export type GetOptions = webfirestore.GetOptions;
    export type GeoPoint = webfirestore.GeoPoint;
    export type Query = webfirestore.Query;
    export type QueryDocumentSnapshot = webfirestore.QueryDocumentSnapshot;
    export type QuerySnapshot = webfirestore.QuerySnapshot;
    export type Transaction = webfirestore.Transaction;
    export type WriteBatch = webfirestore.WriteBatch;
  }
  export namespace cloud {
    export type CollectionReference = cloudfirestore.CollectionReference;
    export type DocumentChange = cloudfirestore.DocumentChange;
    export type DocumentReference = cloudfirestore.DocumentReference;
    export type DocumentSnapshot = cloudfirestore.DocumentSnapshot;
    export type Firestore = cloudfirestore.Firestore;
    export type FieldPath = cloudfirestore.FieldPath;
    export type GeoPoint = cloudfirestore.GeoPoint;
    export type Query = cloudfirestore.Query;
    export type QueryDocumentSnapshot = cloudfirestore.QueryDocumentSnapshot;
    export type QuerySnapshot = cloudfirestore.QuerySnapshot;
    export type Transaction = cloudfirestore.Transaction;
    export type WriteBatch = cloudfirestore.WriteBatch;
  }
}
/* tslint:disable:no-import-side-effect no-namespace */
import * as FirestoreWeb from '@firebase/firestore-types';
import '@google-cloud/firestore/types/firestore';
import '@types/node';
export namespace firestore {
  export namespace web {
    export type CollectionReference = FirestoreWeb.CollectionReference;
    export type DocumentChange = FirestoreWeb.DocumentChange;
    export type DocumentReference = FirestoreWeb.DocumentReference;
    export type DocumentSnapshot = FirestoreWeb.DocumentSnapshot;
    export type GetOptions = FirestoreWeb.GetOptions;
    export type GeoPoint = FirestoreWeb.GeoPoint;
    export type Query = FirestoreWeb.Query;
    export type QuerySnapshot = FirestoreWeb.QuerySnapshot;
    export type WriteBatch = FirestoreWeb.WriteBatch;
  }
  export namespace cloud {
    export type CollectionReference = FirebaseFirestore.CollectionReference;
    export type DocumentChange = FirebaseFirestore.DocumentChange;
    export type DocumentReference = FirebaseFirestore.DocumentReference;
    export type DocumentSnapshot = FirebaseFirestore.DocumentSnapshot;
    export type GeoPoint = FirebaseFirestore.GeoPoint;
    export type Query = FirebaseFirestore.Query;
    export type QuerySnapshot = FirebaseFirestore.QuerySnapshot;
    export type WriteBatch = FirebaseFirestore.WriteBatch;
    export type WriteResult = FirebaseFirestore.WriteResult;
  }
}
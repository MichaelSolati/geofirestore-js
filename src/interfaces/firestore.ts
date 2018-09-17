import * as FirestoreWeb from '@firebase/firestore-types';
import '@google-cloud/firestore/types/firestore';
import '@types/node';
export namespace firestore {
  export interface CollectionReference extends FirestoreWeb.CollectionReference { }
  export interface DocumentChange extends FirestoreWeb.DocumentChange { }
  export interface DocumentReference extends FirestoreWeb.DocumentReference { }
  export interface DocumentSnapshot extends FirestoreWeb.DocumentSnapshot { }
  export interface GetOptions extends FirestoreWeb.GetOptions { }
  export interface GeoPoint extends FirestoreWeb.GeoPoint { }
  export interface Query extends FirestoreWeb.Query { }
  export interface QuerySnapshot extends FirestoreWeb.QuerySnapshot { }
  export interface WriteBatch extends FirestoreWeb.WriteBatch { }
  export namespace cloud {
    export interface CollectionReference extends FirebaseFirestore.CollectionReference { }
    export interface DocumentChange extends FirebaseFirestore.DocumentChange { }
    export interface DocumentReference extends FirebaseFirestore.DocumentReference { }
    export interface DocumentSnapshot extends FirebaseFirestore.DocumentSnapshot { }
    export interface GeoPoint extends FirebaseFirestore.GeoPoint { }
    export interface Query extends FirebaseFirestore.Query { }
    export interface QuerySnapshot extends FirebaseFirestore.QuerySnapshot { }
    export interface WriteBatch extends FirebaseFirestore.WriteBatch { }
    export interface WriteResult extends FirebaseFirestore.WriteResult { }
  }
}
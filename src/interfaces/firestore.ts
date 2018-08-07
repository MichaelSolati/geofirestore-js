import * as typesWeb from '@firebase/firestore-types';
import 'firebase-admin';

export namespace firestore {
  export interface CollectionReference extends typesWeb.CollectionReference { }
  export interface DocumentChange extends typesWeb.DocumentChange { }
  export interface DocumentReference extends typesWeb.DocumentReference { }
  export interface DocumentSnapshot extends typesWeb.DocumentSnapshot { }
  export interface GeoPoint extends typesWeb.GeoPoint { }
  export interface Query extends typesWeb.Query { }
  export interface QuerySnapshot extends typesWeb.QuerySnapshot { }
  export interface WriteBatch extends typesWeb.WriteBatch { }
  export namespace cloud {
    export interface CollectionReference extends typesWeb.CollectionReference { }
  }
}

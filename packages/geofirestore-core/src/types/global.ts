import * as cloudfirestore from '@google-cloud/firestore';
import firebase from 'firebase/compat/app';

import * as web from './web';
import * as cloud from './cloud';

export interface GeoDocumentData extends DocumentData {
  g: {
    /**
     * Geohash of GeoPoint of Document.
     */
    geohash: string;
    /**
     * GeoPoint to index Document by.
     */
    geopoint: web.GeoPoint | cloud.GeoPoint;
  };
}

export interface DocumentData {
  [field: string]: any;
}

export interface DocumentChange<T = GeoDocumentData> {
  /** The document affected by this change. */
  doc: QueryDocumentSnapshot<T>;
  /**
   * The index of the changed document in the result set immediately after
   * this `DocumentChange` (i.e. supposing that all prior `DocumentChange`
   * objects and the current `DocumentChange` object have been applied).
   * Is -1 for 'removed' events.
   */
  newIndex: number;
  /**
   * The index of the changed document in the result set immediately prior to
   * this `DocumentChange` (i.e. supposing that all prior `DocumentChange` objects
   * have been applied). Is -1 for 'added' events.
   */
  oldIndex: number;
  /** The type of change ('added', 'modified', or 'removed'). */
  type: 'added' | 'modified' | 'removed';
}

export interface QueryCriteria {
  /**
   * Starting point of GeoQuery.
   */
  center?: cloud.GeoPoint | web.GeoPoint;
  /**
   * Radius in Km for GeoQuery.
   */
  radius?: number;
  /**
   * Number of Documents to limit query to.
   */
  limit?: number;
}

export interface QueryDocumentSnapshot<T = GeoDocumentData> {
  /**
   * Property of the `DocumentSnapshot` that signals whether or not the data
   * exists. True if the document exists.
   */
  exists: boolean;
  /**
   * Property of the `DocumentSnapshot` that provides the document's ID.
   */
  id: string;
  /**
   * Retrieves all fields in the document as an Object.
   *
   * By default, `FieldValue.serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @return An Object containing all fields in the document.
   */
  data: () => T;
  /**
   * Distance in Km from center of geoquery.
   */
  distance: number;
}

export interface SetOptions {
  /**
   * Key to use for GeoPoint.
   */
  customKey?: string;
  /**
   * Changes the behavior of a set() call to only replace the values specified
   * in its data argument. Fields omitted from the set() call remain
   * untouched.
   */
  merge?: boolean;
  /**
   * Changes the behavior of set() calls to only replace the specified field
   * paths. Any field path that is not specified is ignored and remains
   * untouched.
   */
  mergeFields?: (string | cloud.FieldPath | web.FieldPath)[];
}

export type SnapshotOptions = firebase.firestore.SnapshotOptions;

export interface UpdateData {
  [fieldPath: string]: any;
}

export type WhereFilterOp =
  | firebase.firestore.WhereFilterOp
  | cloudfirestore.WhereFilterOp;

export { web, cloud };

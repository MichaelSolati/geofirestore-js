/* tslint:disable:no-import-side-effect no-namespace no-shadowed-variable */
import * as cloudfirestore from '@google-cloud/firestore';
import firebase from 'firebase/compat/app';

export namespace GeoFirestoreTypes {
  /**
   * Document data with geofirestore specific subobject of `g`.
   */
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
  /**
   * Document data consists of fields mapped to values.
   */
  export interface DocumentData {
    [field: string]: any;
  }
  /**
   * A `DocumentChange` represents a change to the documents matching a query.
   * It contains the document affected and the type of change that occurred.
   */
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
  /**
   * Information for a geoquery, such as the radius of the query,
   * the origin of the query, and how many documents to return.
   */
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
  /**
   * A `QueryDocumentSnapshot` contains data read from a document in your
   * Firestore database as part of a query. The document is guaranteed to exist
   * and its data can be extracted with `.data()` or `.get(<field>)` to get a
   * specific field.
   *
   * A `QueryDocumentSnapshot` offers the same API surface as a
   * `DocumentSnapshot`. Since query results contain only existing documents, the
   * `exists` property will always be true and `data()` will never return
   * 'undefined'.
   */
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
  /**
   * An options object that configures the behavior of `set()` calls in
   * DocumentReference, WriteBatch and Transaction. These calls can be
   * configured to perform granular merges instead of overwriting the target
   * documents in their entirety by providing a `SetOptions` with `merge: true`.
   */
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
  /**
   * Options that configure how data is retrieved from a `DocumentSnapshot`
   * (e.g. the desired behavior for server timestamps that have not yet been set
   * to their final value).
   */
  export type SnapshotOptions = firebase.firestore.SnapshotOptions;
  /**
   * Update data (for use with `DocumentReference.update()`) consists of field
   * paths (e.g. 'foo' or 'foo.baz') mapped to values. Fields that contain dots
   * reference nested fields within the document.
   */
  export interface UpdateData {
    [fieldPath: string]: any;
  }
  /**
   * Filter conditions in a `Query.where()` clause are specified using the
   * strings '<', '<=', '==', '!=', '>=', '>', 'array-contains', 'in',
   * 'array-contains-any', and 'not-in'.
   */
  export type WhereFilterOp =
    | firebase.firestore.WhereFilterOp
    | cloudfirestore.WhereFilterOp;
  export namespace web {
    /**
     * A `CollectionReference` object can be used for adding documents, getting
     * document references, and querying for documents (using the methods
     * inherited from `Query`).
     */
    export type CollectionReference = firebase.firestore.CollectionReference;
    /**
     * A `DocumentChange` represents a change to the documents matching a query.
     * It contains the document affected and the type of change that occurred.
     */
    export type DocumentChange = firebase.firestore.DocumentChange;
    /**
     * A `DocumentReference` refers to a document location in a Firestore database
     * and can be used to write, read, or listen to the location. The document at
     * the referenced location may or may not exist. A `DocumentReference` can
     * also be used to create a `CollectionReference` to a subcollection.
     */
    export type DocumentReference = firebase.firestore.DocumentReference;
    /**
     * A `DocumentSnapshot` contains data read from a document in your Firestore
     * database. The data can be extracted with `.data()` or `.get(<field>)` to
     * get a specific field.
     *
     * For a `DocumentSnapshot` that points to a non-existing document, any data
     * access will return 'undefined'. You can use the `exists` property to
     * explicitly verify a document's existence.
     */
    export type DocumentSnapshot = firebase.firestore.DocumentSnapshot;
    /**
     * The Cloud Firestore service interface.
     *
     * Do not call this constructor directly. Instead, use `firebase.firestore()`.
     */
    export type Firestore = firebase.firestore.Firestore;
    /**
     * A FieldPath refers to a field in a document. The path may consist of a
     * single field name (referring to a top-level field in the document), or a
     * list of field names (referring to a nested field in the document).
     *
     * Create a FieldPath by providing field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     */
    export type FieldPath = firebase.firestore.FieldPath;
    /**
     * An options object that configures the behavior of `get()` calls on
     * `DocumentReference` and `Query`. By providing a `GetOptions` object, these
     * methods can be configured to fetch results only from the server, only from
     * the local cache or attempt to fetch results from the server and fall back to
     * the cache (which is the default).
     */
    export type GetOptions = firebase.firestore.GetOptions;
    /**
     * An immutable object representing a geo point in Firestore. The geo point
     * is represented as latitude/longitude pair.
     *
     * Latitude values are in the range of [-90, 90].
     * Longitude values are in the range of [-180, 180].
     */
    export type GeoPoint = firebase.firestore.GeoPoint;
    /**
     * A `Query` refers to a Query which you can read or listen to. You can also
     * construct refined `Query` objects by adding filters and ordering.
     */
    export type Query = firebase.firestore.Query;
    /**
     * A `QueryDocumentSnapshot` contains data read from a document in your
     * Firestore database as part of a query. The document is guaranteed to exist
     * and its data can be extracted with `.data()` or `.get(<field>)` to get a
     * specific field.
     *
     * A `QueryDocumentSnapshot` offers the same API surface as a
     * `DocumentSnapshot`. Since query results contain only existing documents, the
     * `exists` property will always be true and `data()` will never return
     * 'undefined'.
     */
    export type QueryDocumentSnapshot =
      firebase.firestore.QueryDocumentSnapshot;
    /**
     * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
     * representing the results of a query. The documents can be accessed as an
     * array via the `docs` property or enumerated using the `forEach` method. The
     * number of documents can be determined via the `empty` and `size`
     * properties.
     */
    export type QuerySnapshot = firebase.firestore.QuerySnapshot;
    /**
     * Defines configuration options for the Remote Config SDK.
     */
    export type Settings = firebase.firestore.Settings;
    /**
     * A reference to a transaction.
     * The `Transaction` object passed to a transaction's updateFunction provides
     * the methods to read and write data within the transaction context. See
     * `Firestore.runTransaction()`.
     */
    export type Transaction = firebase.firestore.Transaction;
    /**
     * A write batch, used to perform multiple writes as a single atomic unit.
     *
     * A `WriteBatch` object can be acquired by calling `Firestore.batch()`. It
     * provides methods for adding writes to the write batch. None of the
     * writes will be committed (or visible locally) until `WriteBatch.commit()`
     * is called.
     *
     * Unlike transactions, write batches are persisted offline and therefore are
     * preferable when you don't need to condition your writes on read data.
     */
    export type WriteBatch = firebase.firestore.WriteBatch;
  }
  export namespace cloud {
    /**
     * A `CollectionReference` object can be used for adding documents, getting
     * document references, and querying for documents (using the methods
     * inherited from `Query`).
     */
    export type CollectionReference = cloudfirestore.CollectionReference;
    /**
     * A `DocumentChange` represents a change to the documents matching a query.
     * It contains the document affected and the type of change that occurred.
     */
    export type DocumentChange = cloudfirestore.DocumentChange;
    /**
     * A `DocumentReference` refers to a document location in a Firestore database
     * and can be used to write, read, or listen to the location. The document at
     * the referenced location may or may not exist. A `DocumentReference` can
     * also be used to create a `CollectionReference` to a subcollection.
     */
    export type DocumentReference = cloudfirestore.DocumentReference;
    /**
     * A `DocumentSnapshot` contains data read from a document in your Firestore
     * database. The data can be extracted with `.data()` or `.get(<field>)` to
     * get a specific field.
     *
     * For a `DocumentSnapshot` that points to a non-existing document, any data
     * access will return 'undefined'. You can use the `exists` property to
     * explicitly verify a document's existence.
     */
    export type DocumentSnapshot = cloudfirestore.DocumentSnapshot;
    /**
     * The Cloud Firestore service interface.
     *
     * Do not call this constructor directly. Instead, use `admin.firestore()`.
     */
    export type Firestore = cloudfirestore.Firestore;
    /**
     * A FieldPath refers to a field in a document. The path may consist of a
     * single field name (referring to a top-level field in the document), or a
     * list of field names (referring to a nested field in the document).
     *
     * Create a FieldPath by providing field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     */
    export type FieldPath = cloudfirestore.FieldPath;
    /**
     * An immutable object representing a geo point in Firestore. The geo point
     * is represented as latitude/longitude pair.
     *
     * Latitude values are in the range of [-90, 90].
     * Longitude values are in the range of [-180, 180].
     */
    export type GeoPoint = cloudfirestore.GeoPoint;
    /**
     * A `Query` refers to a Query which you can read or listen to. You can also
     * construct refined `Query` objects by adding filters and ordering.
     */
    export type Query = cloudfirestore.Query;
    /**
     * A `QueryDocumentSnapshot` contains data read from a document in your
     * Firestore database as part of a query. The document is guaranteed to exist
     * and its data can be extracted with `.data()` or `.get(<field>)` to get a
     * specific field.
     *
     * A `QueryDocumentSnapshot` offers the same API surface as a
     * `DocumentSnapshot`. Since query results contain only existing documents, the
     * `exists` property will always be true and `data()` will never return
     * 'undefined'.
     */
    export type QueryDocumentSnapshot = cloudfirestore.QueryDocumentSnapshot;
    /**
     * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
     * representing the results of a query. The documents can be accessed as an
     * array via the `docs` property or enumerated using the `forEach` method. The
     * number of documents can be determined via the `empty` and `size`
     * properties.
     */
    export type QuerySnapshot = cloudfirestore.QuerySnapshot;
    /**
     * Defines configuration options for the Remote Config SDK.
     */
    export type Settings = cloudfirestore.Settings;
    /**
     * A reference to a transaction.
     * The `Transaction` object passed to a transaction's updateFunction provides
     * the methods to read and write data within the transaction context. See
     * `Firestore.runTransaction()`.
     */
    export type Transaction = cloudfirestore.Transaction;
    /**
     * A write batch, used to perform multiple writes as a single atomic unit.
     *
     * A `WriteBatch` object can be acquired by calling `Firestore.batch()`. It
     * provides methods for adding writes to the write batch. None of the
     * writes will be committed (or visible locally) until `WriteBatch.commit()`
     * is called.
     *
     * Unlike transactions, write batches are persisted offline and therefore are
     * preferable when you don't need to condition your writes on read data.
     */
    export type WriteBatch = cloudfirestore.WriteBatch;
  }
}

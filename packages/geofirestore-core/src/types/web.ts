import firebase from 'firebase/compat/app';

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
export type QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

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

import {GeoFirestoreTypes} from './GeoFirestoreTypes';
import {
  encodeSetDocument,
  encodeUpdateDocument,
  sanitizeSetOptions,
} from './utils';
import {GeoCollectionReference} from './GeoCollectionReference';
import {GeoDocumentSnapshot} from './GeoDocumentSnapshot';
import {GeoFirestore} from './GeoFirestore';

/**
 * A `GeoDocumentReference` refers to a document location in a Firestore database and can be used to write, read, or listen to the
 * location. The document at the referenced location may or may not exist. A `GeoDocumentReference` can also be used to create a
 * `CollectionReference` to a subcollection.
 */
export class GeoDocumentReference {
  private _isWeb: boolean;

  /**
   * @param _document The `DocumentReference` instance.
   */
  constructor(
    private _document:
      | GeoFirestoreTypes.cloud.DocumentReference
      | GeoFirestoreTypes.web.DocumentReference
  ) {
    if (Object.prototype.toString.call(_document) !== '[object Object]') {
      throw new Error(
        'DocumentReference must be an instance of a Firestore DocumentReference'
      );
    }
    this._isWeb =
      Object.prototype.toString.call(
        (_document as GeoFirestoreTypes.web.DocumentReference).firestore
          .enablePersistence
      ) === '[object Function]';
  }

  /** The native `DocumentReference` instance. */
  get native():
    | GeoFirestoreTypes.cloud.DocumentReference
    | GeoFirestoreTypes.web.DocumentReference {
    return this._document;
  }

  /** The identifier of the document within its collection. */
  get id(): string {
    return this._document.id;
  }

  /**
   * The `GeoFirestore` for the Firestore database (useful for performing transactions, etc.).
   */
  get firestore(): GeoFirestore {
    return new GeoFirestore(this._document.firestore);
  }

  /**
   * Attaches a listener for GeoDocumentSnapshot events. You may either pass individual `onNext` and `onError` callbacks.
   *
   * @param onNext A callback to be called every time a new `GeoDocumentSnapshot` is available.
   * @param onError A callback to be called if the listen fails or is cancelled. No further callbacks will occur.
   * @return An unsubscribe function that can be called to cancel the snapshot listener.
   */
  get onSnapshot(): (
    onNext: (snapshot: GeoDocumentSnapshot) => void,
    onError?: (error: Error) => void
  ) => () => void {
    return (
      onNext?: (snapshot: GeoDocumentSnapshot) => void,
      onError?: (error: Error) => void
    ) => {
      return (this
        ._document as GeoFirestoreTypes.web.DocumentReference).onSnapshot(
        snapshot => onNext(new GeoDocumentSnapshot(snapshot)),
        error => {
          if (onError) {
            onError(error);
          }
        }
      );
    };
  }

  /**
   * A reference to the GeoCollection to which this GeoDocumentReference belongs.
   */
  get parent(): GeoCollectionReference {
    return new GeoCollectionReference(this._document.parent);
  }

  /**
   * A string representing the path of the referenced document (relative to the root of the database).
   */
  get path(): string {
    return this._document.path;
  }

  /**
   * Gets a `GeoCollectionReference` instance that refers to the collection at the specified path.
   *
   * @param collectionPath A slash-separated path to a collection.
   * @return The `GeoCollectionReference` instance.
   */
  collection(collectionPath: string): GeoCollectionReference {
    return new GeoCollectionReference(
      this._document.collection(collectionPath)
    );
  }

  /**
   * Deletes the document referred to by this `GeoDocumentReference`.
   *
   * @return A Promise resolved once the document has been successfully deleted from the backend (Note that it won't resolve while you're
   * offline).
   */
  delete(): Promise<void> {
    return (this._document as GeoFirestoreTypes.web.DocumentReference)
      .delete()
      .then(() => null);
  }

  /**
   * Reads the document referred to by this `GeoDocumentReference`.
   *
   * Note: By default, get() attempts to provide up-to-date data when possible by waiting for data from the server, but it may return
   * cached data or fail if you are offline and the server cannot be reached. This behavior can be altered via the `GetOptions` parameter.
   *
   * @param options An object to configure the get behavior.
   * @return A Promise resolved with a GeoDocumentSnapshot containing the current document contents.
   */
  get(
    options: GeoFirestoreTypes.web.GetOptions = {source: 'default'}
  ): Promise<GeoDocumentSnapshot> {
    return this._isWeb
      ? (this._document as GeoFirestoreTypes.web.DocumentReference)
          .get(options)
          .then(snapshot => new GeoDocumentSnapshot(snapshot))
      : (this._document as GeoFirestoreTypes.cloud.DocumentReference)
          .get()
          .then(snapshot => new GeoDocumentSnapshot(snapshot));
  }

  /**
   * Returns true if this `GeoDocumentReference` is equal to the provided one.
   *
   * @param other The `DocumentReference` or `GeoDocumentReference` to compare against.
   * @return true if this `DocumentReference` or `GeoDocumentReference` is equal to the provided one.
   */
  isEqual(
    other:
      | GeoDocumentReference
      | GeoFirestoreTypes.cloud.DocumentReference
      | GeoFirestoreTypes.web.DocumentReference
  ): boolean {
    if (other instanceof GeoDocumentReference) {
      return (this
        ._document as GeoFirestoreTypes.cloud.DocumentReference).isEqual(
        other['_document'] as GeoFirestoreTypes.cloud.DocumentReference
      );
    }
    return (this
      ._document as GeoFirestoreTypes.cloud.DocumentReference).isEqual(
      other as GeoFirestoreTypes.cloud.DocumentReference
    );
  }

  /**
   * Writes to the document referred to by this `GeoDocumentReference`. If the document does not yet exist, it will be created. If you pass
   * `SetOptions`, the provided data can be merged into an existing document.
   *
   * @param documentData A map of the fields and values for the document.
   * @param options An object to configure the set behavior. Includes custom key for location in document.
   * @return A Promise resolved once the data has been successfully written to the backend (Note it won't resolve while you're offline).
   */
  set(
    documentData: GeoFirestoreTypes.DocumentData,
    options?: GeoFirestoreTypes.SetOptions
  ): Promise<void> {
    return (this._document as GeoFirestoreTypes.web.DocumentReference)
      .set(
        encodeSetDocument(documentData, options),
        sanitizeSetOptions(options)
      )
      .then(() => null);
  }

  /**
   * Updates fields in the document referred to by this `GeoDocumentReference`. The update will fail if applied to a document that does not
   * exist.
   *
   * @param data An object containing the fields and values with which to update the document. Fields can contain dots to reference nested
   * fields within the document.
   * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
   * @return A Promise resolved once the data has been successfully written to the backend (Note it won't resolve while you're offline).
   */
  update(
    data: GeoFirestoreTypes.UpdateData,
    customKey?: string
  ): Promise<void> {
    return (this._document as GeoFirestoreTypes.web.DocumentReference)
      .update(encodeUpdateDocument(data, customKey))
      .then(() => null);
  }
}

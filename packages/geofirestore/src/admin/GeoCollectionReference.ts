import {GeoFirestoreTypes, encodeDocumentAdd} from 'geofirestore-core';

import {GeoDocumentReference} from './GeoDocumentReference';
import {GeoQuery} from './GeoQuery';

/**
 * A `GeoCollectionReference` object can be used for adding documents, getting document references, and querying for documents (using the
 * methods inherited from `GeoQuery`).
 */
export class GeoCollectionReference extends GeoQuery {
  /**
   * @param _collection The `CollectionReference` instance.
   * @param _customKey Key to use for GeoPoints in a collection.
   */
  constructor(
    private _collection:
      | GeoFirestoreTypes.admin.CollectionReference
      | GeoFirestoreTypes.compat.CollectionReference,
    private _customKey?: string
  ) {
    super(_collection);
  }

  /** The native `CollectionReference` instance. */
  get native():
    | GeoFirestoreTypes.admin.CollectionReference
    | GeoFirestoreTypes.compat.CollectionReference {
    return this._collection;
  }

  /** The identifier of the collection. */
  get id(): string {
    return this._collection.id;
  }

  /**
   * A reference to the containing Document if this is a subcollection, else null.
   */
  get parent(): GeoDocumentReference | null {
    return this._collection.parent
      ? new GeoDocumentReference(this._collection.parent)
      : null;
  }

  /**
   * A string representing the path of the referenced collection (relative
   * to the root of the database).
   */
  get path(): string {
    return this._collection.path;
  }

  /**
   * Add a new document to this collection with the specified data, assigning it a document ID automatically.
   *
   * @param documentData An Object containing the data for the new document.
   * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
   * @return A Promise resolved with a `GeoDocumentReference` pointing to the newly created document after it has been written to the
   * backend.
   */
  add(
    documentData: GeoFirestoreTypes.DocumentData,
    customKey: string = this._customKey
  ): Promise<GeoDocumentReference> {
    return (this._collection as GeoFirestoreTypes.admin.CollectionReference)
      .add(encodeDocumentAdd(documentData, customKey))
      .then(doc => new GeoDocumentReference(doc));
  }

  /**
   * Get a `GeoDocumentReference` for the document within the collection at the specified path. If no path is specified, an
   * automatically-generated unique ID will be used for the returned GeoDocumentReference.
   *
   * @param documentPath A slash-separated path to a document.
   * @return The `GeoDocumentReference` instance.
   */
  doc(documentPath?: string): GeoDocumentReference {
    return documentPath
      ? new GeoDocumentReference(this._collection.doc(documentPath))
      : new GeoDocumentReference(this._collection.doc());
  }
}

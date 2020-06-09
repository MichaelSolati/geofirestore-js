import {GeoFirestoreTypes} from './GeoFirestoreTypes';
import {GeoDocumentReference} from './GeoDocumentReference';
import {GeoQuery} from './GeoQuery';
import {findCoordinates, encodeGeohash, encodeGeoDocument} from './utils';

/**
 * A `GeoCollectionReference` object can be used for adding documents, getting document references, and querying for documents (using the
 * methods inherited from `GeoQuery`).
 */
export class GeoCollectionReference extends GeoQuery {
  /**
   * @param _collection The `CollectionReference` instance.
   */
  constructor(
    private _collection:
      | GeoFirestoreTypes.cloud.CollectionReference
      | GeoFirestoreTypes.web.CollectionReference
  ) {
    super(_collection);
  }

  /** The native `CollectionReference` instance. */
  get native():
    | GeoFirestoreTypes.cloud.CollectionReference
    | GeoFirestoreTypes.web.CollectionReference {
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
    customKey?: string
  ): Promise<GeoDocumentReference> {
    if (Object.prototype.toString.call(documentData) === '[object Object]') {
      const location = findCoordinates(documentData, customKey);
      const geohash: string = encodeGeohash(location);
      return (this._collection as GeoFirestoreTypes.cloud.CollectionReference)
        .add(encodeGeoDocument(location, geohash, documentData))
        .then(doc => new GeoDocumentReference(doc));
    } else {
      throw new Error('document must be an object');
    }
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

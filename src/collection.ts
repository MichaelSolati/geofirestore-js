import { GeoFirestoreTypes } from './interfaces';
import { GeoDocumentReference } from './documentReference';
import { GeoQuery } from './query';
import { findCoordinatesKey, encodeGeohash, encodeGeoDocument } from './utils';

/**
 * A `GeoCollectionReference` object can be used for adding documents, getting document references, and querying for documents (using the
 * methods inherited from `GeoQuery`).
 */
export class GeoCollectionReference extends GeoQuery {
  /**
   * @param _collection The `CollectionReference` instance.
   */
  constructor(private _collection: GeoFirestoreTypes.cloud.CollectionReference | GeoFirestoreTypes.web.CollectionReference) {
    super(_collection);
    if (Object.prototype.toString.call(_collection) !== '[object Object]') {
      throw new Error('CollectionReference must be an instance of a Firestore CollectionReference');
    }
  }

  /** The identifier of the collection. */
  get id(): string {
    return this._collection.id;
  }

  /**
   * A reference to the containing Document if this is a subcollection, else null.
   */
  get parent(): GeoDocumentReference | null {
    return this._collection.parent ? new GeoDocumentReference(this._collection.parent) : null;
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
   * @param data An Object containing the data for the new document.
   * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
   * @return A Promise resolved with a `GeoDocumentReference` pointing to the newly created document after it has been written to the
   * backend.
   */
  public add(
    data: GeoFirestoreTypes.DocumentData,
    customKey?: string
  ): Promise<GeoDocumentReference> {
    if (Object.prototype.toString.call(data) === '[object Object]') {
      const locationKey: string = findCoordinatesKey(data, customKey);
      const location: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint = data[locationKey];
      const geohash: string = encodeGeohash(location);
      return (this._collection as GeoFirestoreTypes.cloud.CollectionReference)
        .add(encodeGeoDocument(location, geohash, data)).then(doc => new GeoDocumentReference(doc));
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
  public doc(documentPath?: string): GeoDocumentReference {
    return new GeoDocumentReference(this._collection.doc(documentPath));
  }
}

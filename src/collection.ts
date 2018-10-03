import { GeoFirestoreTypes, DocumentData } from './interfaces';
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

  /**
   * Gets a `CollectionReference` instance of the collection used by the GeoCollectionReference. Using this object for queries and other
   * commands WILL NOT take advantage of GeoFirestore's geo based logic.
   */
  get collection(): GeoFirestoreTypes.cloud.CollectionReference | GeoFirestoreTypes.web.CollectionReference {
    return this._collection;
  }

  /**
   * Add a new document to this collection with the specified data, assigning it a document ID automatically.
   *
   * @param data An Object containing the data for the new document.
   * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
   * @return A Promise resolved with a `DocumentReference` pointing to the newly created document after it has been written to the backend.
   */
  public add(
    data: DocumentData,
    customKey?: string
  ): Promise<GeoFirestoreTypes.cloud.DocumentReference> | Promise<GeoFirestoreTypes.web.DocumentReference> {
    if (Object.prototype.toString.call(data) === '[object Object]') {
      const locationKey: string = findCoordinatesKey(data, customKey);
      const location: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint = data[locationKey];
      const geohash: string = encodeGeohash(location);
      return this._collection.add(encodeGeoDocument(location, geohash, data));
    } else {
      throw new Error('document must be an object');
    }
  }
}

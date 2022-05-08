import {hash} from 'geokit';
import {validateLocation} from './validate';
import {GeoFirestoreTypes} from '../definitions';
import {findGeoPoint} from '../utils';

/**
 * Encodes a Firestore Document to be added as a GeoDocument.
 *
 * @param documentData The document being set.
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @return The document encoded as GeoDocument object.
 */
export function encodeDocumentAdd(
  documentData:
    | GeoFirestoreTypes.DocumentData
    | GeoFirestoreTypes.modular.WithFieldValue<any>,
  customKey?: string
):
  | GeoFirestoreTypes.GeoDocumentData
  | GeoFirestoreTypes.modular.WithFieldValue<any> {
  if (Object.prototype.toString.call(documentData) !== '[object Object]') {
    throw new Error('document must be an object');
  }
  const geopoint = findGeoPoint(documentData, customKey);
  return encodeGeoDocument(geopoint, documentData);
}

/**
 * Encodes a Firestore Document to be set as a GeoDocument.
 *
 * @param documentData A map of the fields and values for the document.
 * @param options An object to configure the set behavior. Includes custom key for location in document.
 * @return The document encoded as GeoDocument object.
 */
export function encodeDocumentSet(
  documentData:
    | GeoFirestoreTypes.DocumentData
    | GeoFirestoreTypes.modular.WithFieldValue<any>,
  options?: GeoFirestoreTypes.SetOptions
):
  | GeoFirestoreTypes.GeoDocumentData
  | GeoFirestoreTypes.DocumentData
  | GeoFirestoreTypes.modular.WithFieldValue<any> {
  if (Object.prototype.toString.call(documentData) !== '[object Object]') {
    throw new Error('document must be an object');
  }
  const customKey = options && options.customKey;
  const geopoint = findGeoPoint(
    documentData,
    customKey,
    options && (options.merge || !!options.mergeFields)
  );
  return geopoint ? encodeGeoDocument(geopoint, documentData) : documentData;
}

/**
 * Encodes a Firestore Document to be updated as a GeoDocument.
 *
 * @param documentData The document being updated.
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @return The document encoded as GeoDocument object.
 */
export function encodeDocumentUpdate(
  documentData:
    | GeoFirestoreTypes.UpdateData
    | GeoFirestoreTypes.modular.WithFieldValue<any>,
  customKey?: string
):
  | GeoFirestoreTypes.UpdateData
  | GeoFirestoreTypes.modular.WithFieldValue<any> {
  if (Object.prototype.toString.call(documentData) !== '[object Object]') {
    throw new Error('document must be an object');
  }
  const geopoint = findGeoPoint(documentData, customKey, true);
  return geopoint ? encodeGeoDocument(geopoint, documentData) : documentData;
}

/**
 * Encodes a document with a GeoPoint as a GeoDocument.
 *
 * @param geopoint The location as a Firestore GeoPoint.
 * @param documentData Document to encode.
 * @return The document encoded as GeoDocument object.
 */
export function encodeGeoDocument(
  geopoint:
    | GeoFirestoreTypes.admin.GeoPoint
    | GeoFirestoreTypes.compat.GeoPoint,
  documentData: GeoFirestoreTypes.DocumentData
): GeoFirestoreTypes.GeoDocumentData {
  validateLocation(geopoint);
  const geohash = hash({
    lat: geopoint.latitude,
    lng: geopoint.longitude,
  });
  return {
    ...documentData,
    g: {
      geopoint,
      geohash,
    },
  };
}

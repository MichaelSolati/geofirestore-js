import {validateHash} from 'geokit';
import {GeoFirestoreTypes} from '../definitions';

/**
 * Validates the inputted GeoDocument object and throws an error, or returns boolean, if it is invalid.
 *
 * @param documentData The GeoDocument object to be validated.
 * @param flag Tells function to send up boolean if valid instead of throwing an error.
 * @return Flag if data is valid
 */
export function validateGeoDocument(
  documentData: GeoFirestoreTypes.GeoDocumentData,
  flag = false
): boolean {
  let error: string;

  if (Object.prototype.toString.call(documentData) !== '[object Object]') {
    error = 'no document found';
  } else if ('g' in documentData) {
    error = !validateHash(documentData.g.geohash, true)
      ? 'invalid geohash on object'
      : error;
    error = !validateLocation(documentData.g.geopoint, true)
      ? 'invalid location on object'
      : error;
  } else {
    error = 'no `g` field found in object';
  }

  if (typeof error !== 'undefined' && !flag) {
    throw new Error('Invalid GeoFirestore object: ' + error);
  } else {
    return !error;
  }
}

/**
 * Validates the inputted limit and throws an error, or returns boolean, if it is invalid.
 *
 * @param limit The limit to be applied by `GeoQuery.limit()`
 * @param flag Tells function to send up boolean if valid instead of throwing an error.
 */
export function validateLimit(limit: number, flag = false): boolean {
  let error: string;
  if (typeof limit !== 'number' || isNaN(limit)) {
    error = 'limit must be a number';
  } else if (limit < 0) {
    error = 'limit must be greater than or equal to 0';
  }

  if (typeof error !== 'undefined' && !flag) {
    throw new Error(error);
  } else {
    return !error;
  }
}

/**
 * Validates a GeoPoint object and returns a boolean if valid, or throws an error if invalid.
 *
 * @param location The Firestore GeoPoint to be verified.
 * @param flag Tells function to send up boolean if not valid instead of throwing an error.
 */
export function validateLocation(
  location:
    | GeoFirestoreTypes.compat.GeoPoint
    | GeoFirestoreTypes.admin.GeoPoint,
  flag = false
): boolean {
  let error: string;

  if (!location) {
    error = 'GeoPoint must exist';
  } else if (typeof location.latitude === 'undefined') {
    error = 'latitude must exist on GeoPoint';
  } else if (typeof location.longitude === 'undefined') {
    error = 'longitude must exist on GeoPoint';
  } else {
    const latitude = location.latitude;
    const longitude = location.longitude;

    if (typeof latitude !== 'number' || isNaN(latitude)) {
      error = 'latitude must be a number';
    } else if (latitude < -90 || latitude > 90) {
      error = 'latitude must be within the range [-90, 90]';
    } else if (typeof longitude !== 'number' || isNaN(longitude)) {
      error = 'longitude must be a number';
    } else if (longitude < -180 || longitude > 180) {
      error = 'longitude must be within the range [-180, 180]';
    }
  }

  if (typeof error !== 'undefined' && !flag) {
    throw new Error('Invalid location: ' + error);
  } else {
    return !error;
  }
}

/**
 * Validates the inputted query criteria and throws an error if it is invalid.
 *
 * @param newQueryCriteria The criteria which specifies the query's center and/or radius.
 * @param requireCenterAndRadius The criteria which center and radius required.
 */
export function validateQueryCriteria(
  newQueryCriteria: GeoFirestoreTypes.QueryCriteria,
  requireCenterAndRadius = false
): void {
  if (typeof newQueryCriteria !== 'object') {
    throw new Error('QueryCriteria must be an object');
  } else if (
    typeof newQueryCriteria.center === 'undefined' &&
    typeof newQueryCriteria.radius === 'undefined'
  ) {
    throw new Error('radius and/or center must be specified');
  } else if (
    requireCenterAndRadius &&
    (typeof newQueryCriteria.center === 'undefined' ||
      typeof newQueryCriteria.radius === 'undefined')
  ) {
    throw new Error(
      'QueryCriteria for a new query must contain both a center and a radius'
    );
  }

  // Throw an error if there are any extraneous attributes
  const keys: string[] = Object.keys(newQueryCriteria);
  for (const key of keys) {
    if (!['center', 'radius', 'limit'].includes(key)) {
      throw new Error(
        "Unexpected attribute '" + key + "' found in query criteria"
      );
    }
  }

  // Validate the 'center' attribute
  if (typeof newQueryCriteria.center !== 'undefined') {
    validateLocation(newQueryCriteria.center);
  }

  // Validate the 'radius' attribute
  if (typeof newQueryCriteria.radius !== 'undefined') {
    if (
      typeof newQueryCriteria.radius !== 'number' ||
      isNaN(newQueryCriteria.radius)
    ) {
      throw new Error('radius must be a number');
    } else if (newQueryCriteria.radius < 0) {
      throw new Error('radius must be greater than or equal to 0');
    }
  }

  // Validate the 'limit' attribute
  if (typeof newQueryCriteria.limit !== 'undefined') {
    validateLimit(newQueryCriteria.limit);
  }
}

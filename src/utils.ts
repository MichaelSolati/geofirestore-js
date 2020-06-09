import {GeoFirestoreTypes} from './GeoFirestoreTypes';

// Characters used in location geohashes
export const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

// Number of bits per geohash character
export const BITS_PER_CHAR = 5;

// The following value assumes a polar radius of
// const EARTH_POL_RADIUS = 6356752.3;
// The formulate to calculate E2 is
// E2 == (EARTH_EQ_RADIUS^2-EARTH_POL_RADIUS^2)/(EARTH_EQ_RADIUS^2)
// The exact value is used here to avoid rounding errors
export const E2 = 0.00669447819799;

// Equatorial radius of the earth in meters
export const EARTH_EQ_RADIUS = 6378137.0;

// The meridional circumference of the earth in meters
export const EARTH_MERI_CIRCUMFERENCE = 40007860;

// Cutoff for rounding errors on double calculations
export const EPSILON = 1e-12;

// Default geohash length
export const GEOHASH_PRECISION = 10;

// Maximum length of a geohash in bits
export const MAXIMUM_BITS_PRECISION = 22 * BITS_PER_CHAR;

// Length of a degree latitude at the equator
export const METERS_PER_DEGREE_LATITUDE = 110574;

/**
 * Calculates the maximum number of bits of a geohash to get a bounding box that is larger than a given size at the given coordinate.
 *
 * @param coordinate The coordinate as a Firestore GeoPoint.
 * @param size The size of the bounding box.
 * @return The number of bits necessary for the geohash.
 */
export function boundingBoxBits(
  coordinate: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint,
  size: number
): number {
  const latDeltaDegrees = size / METERS_PER_DEGREE_LATITUDE;
  const latitudeNorth = Math.min(90, coordinate.latitude + latDeltaDegrees);
  const latitudeSouth = Math.max(-90, coordinate.latitude - latDeltaDegrees);
  const bitsLat = Math.floor(latitudeBitsForResolution(size)) * 2;
  const bitsLongNorth =
    Math.floor(longitudeBitsForResolution(size, latitudeNorth)) * 2 - 1;
  const bitsLongSouth =
    Math.floor(longitudeBitsForResolution(size, latitudeSouth)) * 2 - 1;
  return Math.min(
    bitsLat,
    bitsLongNorth,
    bitsLongSouth,
    MAXIMUM_BITS_PRECISION
  );
}

/**
 * Calculates eight points on the bounding box and the center of a given circle. At least one geohash of these nine coordinates, truncated'
 * to a precision of at most radius, are guaranteed to be prefixes of any geohash that lies within the circle.
 *
 * @param center The center given as Firestore GeoPoint.
 * @param radius The radius of the circle.
 * @return The eight bounding box points.
 */
export function boundingBoxCoordinates(
  center: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint,
  radius: number
): GeoFirestoreTypes.cloud.GeoPoint[] | GeoFirestoreTypes.web.GeoPoint[] {
  const latDegrees = radius / METERS_PER_DEGREE_LATITUDE;
  const latitudeNorth = Math.min(90, center.latitude + latDegrees);
  const latitudeSouth = Math.max(-90, center.latitude - latDegrees);
  const longDegsNorth = metersToLongitudeDegrees(radius, latitudeNorth);
  const longDegsSouth = metersToLongitudeDegrees(radius, latitudeSouth);
  const longDegs = Math.max(longDegsNorth, longDegsSouth);
  return [
    toGeoPoint(center.latitude, center.longitude),
    toGeoPoint(center.latitude, wrapLongitude(center.longitude - longDegs)),
    toGeoPoint(center.latitude, wrapLongitude(center.longitude + longDegs)),
    toGeoPoint(latitudeNorth, center.longitude),
    toGeoPoint(latitudeNorth, wrapLongitude(center.longitude - longDegs)),
    toGeoPoint(latitudeNorth, wrapLongitude(center.longitude + longDegs)),
    toGeoPoint(latitudeSouth, center.longitude),
    toGeoPoint(latitudeSouth, wrapLongitude(center.longitude - longDegs)),
    toGeoPoint(latitudeSouth, wrapLongitude(center.longitude + longDegs)),
  ];
}

/**
 * Method which calculates the distance, in kilometers, between two locations, via the Haversine formula. Note that this is approximate due
 * to the fact that the Earth's radius varies between 6356.752 km and 6378.137 km.
 *
 * @param location1 The GeoPoint of the first location.
 * @param location2 The GeoPoint of the second location.
 * @return The distance, in kilometers, between the inputted locations.
 */
export function calculateDistance(
  location1: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint,
  location2: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint
): number {
  validateLocation(location1);
  validateLocation(location2);

  const radius = 6371; // Earth's radius in kilometers
  const latDelta = degreesToRadians(location2.latitude - location1.latitude);
  const lonDelta = degreesToRadians(location2.longitude - location1.longitude);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(degreesToRadians(location1.latitude)) *
      Math.cos(degreesToRadians(location2.latitude)) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c;
}

/**
 * Decodes the GeoDocument data. Returns non-decoded data if decoding fails.
 *
 * @param data The data encoded as a GeoDocument object.
 * @param center The center to calculate the distance of the Document from the query origin.
 * @return The decoded Firestore document or non-decoded data if decoding fails in an object including distance from origin.
 */
export function decodeGeoQueryDocumentSnapshotData(
  data: GeoFirestoreTypes.GeoDocumentData,
  center?: GeoFirestoreTypes.web.GeoPoint | GeoFirestoreTypes.cloud.GeoPoint
): {data: () => GeoFirestoreTypes.GeoDocumentData; distance: number} {
  if (validateGeoDocument(data, true)) {
    const distance = center
      ? calculateDistance(data.g.coordinates, center)
      : null;
    return {data: () => data, distance};
  }
  return {data: () => data, distance: null};
}

/**
 * Converts degrees to radians.
 *
 * @param degrees The number of degrees to be converted to radians.
 * @return The number of radians equal to the inputted number of degrees.
 */
export function degreesToRadians(degrees: number): number {
  if (typeof degrees !== 'number' || isNaN(degrees)) {
    throw new Error('Error: degrees must be a number');
  }

  return (degrees * Math.PI) / 180;
}

/**
 * Generates a geohash of the specified precision/string length from the inputted GeoPoint.
 *
 * @param location The GeoPoint to encode into a geohash.
 * @param precision The length of the geohash to create. If no precision is specified, the global default is used.
 * @return The geohash of the inputted location.
 */
export function encodeGeohash(
  location: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint,
  precision: number = GEOHASH_PRECISION
): string {
  validateLocation(location);
  if (typeof precision === 'number' && !isNaN(precision)) {
    if (precision <= 0) {
      throw new Error('precision must be greater than 0');
    } else if (precision > 22) {
      throw new Error('precision cannot be greater than 22');
    } else if (Math.round(precision) !== precision) {
      throw new Error('precision must be an integer');
    }
  } else {
    throw new Error('precision must be a number');
  }

  const latitudeRange = {
    min: -90,
    max: 90,
  };
  const longitudeRange = {
    min: -180,
    max: 180,
  };
  let hash = '';
  let hashVal = 0;
  let bits = 0;
  let even: number | boolean = 1;

  while (hash.length < precision) {
    const val = even ? location.longitude : location.latitude;
    const range = even ? longitudeRange : latitudeRange;
    const mid = (range.min + range.max) / 2;

    if (val > mid) {
      hashVal = (hashVal << 1) + 1;
      range.min = mid;
    } else {
      hashVal = (hashVal << 1) + 0;
      range.max = mid;
    }

    even = !even;
    if (bits < 4) {
      bits++;
    } else {
      bits = 0;
      hash += BASE32[hashVal];
      hashVal = 0;
    }
  }

  return hash;
}

/**
 * Encodes a location and geohash as a GeoDocument.
 *
 * @param coordinates The location as a Firestore GeoPoint.
 * @param geohash The geohash of the location.
 * @return The document encoded as GeoDocument object.
 */
export function encodeGeoDocument(
  coordinates:
    | GeoFirestoreTypes.cloud.GeoPoint
    | GeoFirestoreTypes.web.GeoPoint,
  geohash: string,
  document: GeoFirestoreTypes.DocumentData
): GeoFirestoreTypes.GeoDocumentData {
  validateLocation(coordinates);
  validateGeohash(geohash);
  document.g = {
    coordinates,
    geohash,
  };
  return document;
}

/**
 * Remove customKey attribute so firestore doesn't' reject.
 *
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @return The same object but without custom key
 */
export function sanitizeSetOptions(
  options: GeoFirestoreTypes.SetOptions
): GeoFirestoreTypes.SetOptions {
  const clone = {...options};
  delete clone.customKey;
  return clone;
}

/**
 * Encodes a Document used by GeoWriteBatch.set as a GeoDocument.
 *
 * @param documentData The document being set.
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @return The document encoded as GeoDocument object.
 */
export function encodeSetDocument(
  documentData: GeoFirestoreTypes.DocumentData,
  options?: GeoFirestoreTypes.SetOptions
): GeoFirestoreTypes.GeoDocumentData {
  if (Object.prototype.toString.call(documentData) === '[object Object]') {
    const customKey = options ? options.customKey : null;
    const coordinates = findCoordinates(
      documentData,
      customKey,
      options && (options.merge || !!options.mergeFields)
    );
    if (coordinates) {
      const geohash: string = encodeGeohash(coordinates);
      return encodeGeoDocument(coordinates, geohash, documentData);
    }
    return documentData;
  } else {
    throw new Error('document must be an object');
  }
}

/**
 * Encodes a Document used by GeoWriteBatch.update as a GeoDocument.
 *
 * @param data The document being updated.
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @return The document encoded as GeoDocument object.
 */
export function encodeUpdateDocument(
  data: GeoFirestoreTypes.UpdateData,
  customKey?: string
): GeoFirestoreTypes.UpdateData {
  if (Object.prototype.toString.call(data) === '[object Object]') {
    const coordinates = findCoordinates(data, customKey, true);
    if (coordinates) {
      data.g = {
        coordinates,
        geohash: encodeGeohash(coordinates),
      };
    }
    return data;
  } else {
    throw new Error('document must be an object');
  }
}

/**
 * Returns coordinates as GeoPoint from a document.
 *
 * @param document A Firestore document.
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @param flag Tells function supress errors.
 * @return The GeoPoint for the location field of a document.
 */
export function findCoordinates(
  document: GeoFirestoreTypes.DocumentData,
  customKey?: string,
  flag = false
): GeoFirestoreTypes.web.GeoPoint | GeoFirestoreTypes.cloud.GeoPoint {
  let error: string;
  let coordinates;

  if (!customKey) {
    coordinates = document['coordinates'];
  } else if (customKey in document) {
    coordinates = document[customKey];
  } else {
    const props = customKey.split('.');
    coordinates = document;
    for (const prop of props) {
      if (!(prop in coordinates)) {
        coordinates = document['coordinates'];
        break;
      }
      coordinates = coordinates[prop];
    }
  }

  if (!coordinates) {
    error = 'could not find GeoPoint';
  }

  if (coordinates && !validateLocation(coordinates, true)) {
    error = 'invalid GeoPoint';
  }

  if (error && !flag) {
    throw new Error('Invalid GeoFirestore document: ' + error);
  }

  return coordinates;
}

/**
 * Creates GeoFirestore QueryDocumentSnapshot by pulling data out of original Firestore QueryDocumentSnapshot and strip GeoFirsetore
 * Document data, such as geohash and coordinates.
 *
 * @param snapshot The QueryDocumentSnapshot.
 * @param center The center to calculate the distance of the Document from the query origin.
 * @return The snapshot as a GeoFirestore QueryDocumentSnapshot.
 */
export function generateGeoQueryDocumentSnapshot(
  snapshot:
    | GeoFirestoreTypes.web.QueryDocumentSnapshot
    | GeoFirestoreTypes.cloud.QueryDocumentSnapshot,
  center?: GeoFirestoreTypes.web.GeoPoint | GeoFirestoreTypes.cloud.GeoPoint
): GeoFirestoreTypes.QueryDocumentSnapshot {
  const decoded = decodeGeoQueryDocumentSnapshotData(
    snapshot.data() as GeoFirestoreTypes.GeoDocumentData,
    center
  );
  return {
    exists: snapshot.exists,
    id: snapshot.id,
    ...decoded,
  };
}

/**
 * Calculates a set of queries to fully contain a given circle. A query is a GeoPoint where any geohash is guaranteed to be
 * lexiographically larger then start and smaller than end.
 *
 * @param center The center given as a GeoPoint.
 * @param radius The radius of the circle.
 * @return An array of geohashes containing a GeoPoint.
 */
export function geohashQueries(
  center: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint,
  radius: number
): string[][] {
  validateLocation(center);
  const queryBits = Math.max(1, boundingBoxBits(center, radius));
  const geohashPrecision = Math.ceil(queryBits / BITS_PER_CHAR);
  const coordinates:
    | GeoFirestoreTypes.cloud.GeoPoint
    | GeoFirestoreTypes.web.GeoPoint[] = boundingBoxCoordinates(center, radius);
  const queries = coordinates.map(coordinate => {
    return geohashQuery(encodeGeohash(coordinate, geohashPrecision), queryBits);
  });
  // remove duplicates
  return queries.filter((query, index) => {
    return !queries.some((other, otherIndex) => {
      return (
        index > otherIndex && query[0] === other[0] && query[1] === other[1]
      );
    });
  });
}

/**
 * Calculates the bounding box query for a geohash with x bits precision.
 *
 * @param geohash The geohash whose bounding box query to generate.
 * @param bits The number of bits of precision.
 * @return A [start, end] pair of geohashes.
 */
export function geohashQuery(geohash: string, bits: number): string[] {
  validateGeohash(geohash);
  const precision = Math.ceil(bits / BITS_PER_CHAR);
  if (geohash.length < precision) {
    return [geohash, geohash + '~'];
  }
  const ghash = geohash.substring(0, precision);
  const base = ghash.substring(0, ghash.length - 1);
  const lastValue = BASE32.indexOf(ghash.charAt(ghash.length - 1));
  const significantBits = bits - base.length * BITS_PER_CHAR;
  const unusedBits = BITS_PER_CHAR - significantBits;
  // delete unused bits
  const startValue = (lastValue >> unusedBits) << unusedBits;
  const endValue = startValue + (1 << unusedBits);
  if (endValue > 31) {
    return [base + BASE32[startValue], base + '~'];
  } else {
    return [base + BASE32[startValue], base + BASE32[endValue]];
  }
}

/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the latitude.
 *
 * @param resolution The bits necessary to reach a given resolution, in meters.
 * @return Bits necessary to reach a given resolution, in meters, for the latitude.
 */
export function latitudeBitsForResolution(resolution: number): number {
  return Math.min(
    log2(EARTH_MERI_CIRCUMFERENCE / 2 / resolution),
    MAXIMUM_BITS_PRECISION
  );
}

/**
 * Calculates the base 2 logarithm of the given number.
 *
 * @param x A number
 * @return The base 2 logarithm of a number
 */
export function log2(x: number): number {
  return Math.log(x) / Math.log(2);
}

/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the longitude at a given latitude.
 *
 * @param resolution The desired resolution.
 * @param latitude The latitude used in the conversion.
 * @return The bits necessary to reach a given resolution, in meters.
 */
export function longitudeBitsForResolution(
  resolution: number,
  latitude: number
): number {
  const degs = metersToLongitudeDegrees(resolution, latitude);
  return Math.abs(degs) > 0.000001 ? Math.max(1, log2(360 / degs)) : 1;
}

/**
 * Calculates the number of degrees a given distance is at a given latitude.
 *
 * @param distance The distance to convert.
 * @param latitude The latitude at which to calculate.
 * @return The number of degrees the distance corresponds to.
 */
export function metersToLongitudeDegrees(
  distance: number,
  latitude: number
): number {
  const radians = degreesToRadians(latitude);
  const num = (Math.cos(radians) * EARTH_EQ_RADIUS * Math.PI) / 180;
  const denom = 1 / Math.sqrt(1 - E2 * Math.sin(radians) * Math.sin(radians));
  const deltaDeg = num * denom;
  if (deltaDeg < EPSILON) {
    return distance > 0 ? 360 : 0;
  } else {
    return Math.min(360, distance / deltaDeg);
  }
}

/**
 * Returns a 'GeoPoint.' (Kind of fake, but get's the job done!)
 *
 * @param latitude Latitude for GeoPoint.
 * @param longitude Longitude for GeoPoint.
 * @return Firestore "GeoPoint"
 */
export function toGeoPoint(
  latitude: number,
  longitude: number
): GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint {
  const fakeGeoPoint:
    | GeoFirestoreTypes.cloud.GeoPoint
    | GeoFirestoreTypes.web.GeoPoint = {latitude, longitude} as
    | GeoFirestoreTypes.cloud.GeoPoint
    | GeoFirestoreTypes.web.GeoPoint;
  validateLocation(fakeGeoPoint);
  return fakeGeoPoint;
}

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

  if (!documentData) {
    error = 'no document found';
  } else if ('g' in documentData) {
    error = !validateGeohash(documentData.g.geohash, true)
      ? 'invalid geohash on object'
      : null;
    error = !validateLocation(documentData.g.coordinates, true)
      ? 'invalid location on object'
      : error;
  } else {
    error = 'no `.g` field found in object';
  }

  if (error && !flag) {
    throw new Error('Invalid GeoFirestore object: ' + error);
  } else {
    return !error;
  }
}

/**
 * Validates the inputted geohash and throws an error, or returns boolean, if it is invalid.
 *
 * @param geohash The geohash to be validated.
 * @param flag Tells function to send up boolean if valid instead of throwing an error.
 */
export function validateGeohash(geohash: string, flag = false): boolean {
  let error;

  if (typeof geohash !== 'string') {
    error = 'geohash must be a string';
  } else if (geohash.length === 0) {
    error = 'geohash cannot be the empty string';
  } else {
    for (const letter of geohash) {
      if (BASE32.indexOf(letter) === -1) {
        error = "geohash cannot contain '" + letter + "'";
      }
    }
  }

  if (typeof error !== 'undefined' && !flag) {
    throw new Error("Invalid GeoFire geohash '" + geohash + "': " + error);
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
 * Validates the inputted location and throws an error, or returns boolean, if it is invalid.
 *
 * @param location The Firestore GeoPoint to be verified.
 * @param flag Tells function to send up boolean if valid instead of throwing an error.
 */
export function validateLocation(
  location: GeoFirestoreTypes.web.GeoPoint | GeoFirestoreTypes.cloud.GeoPoint,
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

/**
 * Wraps the longitude to [-180,180].
 *
 * @param longitude The longitude to wrap.
 * @return longitude The resulting longitude.
 */
export function wrapLongitude(longitude: number): number {
  if (longitude <= 180 && longitude >= -180) {
    return longitude;
  }
  const adjusted = longitude + 180;
  if (adjusted > 0) {
    return (adjusted % 360) - 180;
  } else {
    return 180 - (-adjusted % 360);
  }
}

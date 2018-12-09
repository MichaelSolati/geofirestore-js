import { firestore, GeoFirestoreObj, QueryCriteria } from './interfaces';

// Default geohash length
export const GEOHASH_PRECISION = 10;

// Characters used in location geohashes
export const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

// The meridional circumference of the earth in meters
export const EARTH_MERI_CIRCUMFERENCE = 40007860;

// Length of a degree latitude at the equator
export const METERS_PER_DEGREE_LATITUDE = 110574;

// Number of bits per geohash character
export const BITS_PER_CHAR = 5;

// Maximum length of a geohash in bits
export const MAXIMUM_BITS_PRECISION = 22 * BITS_PER_CHAR;

// Equatorial radius of the earth in meters
export const EARTH_EQ_RADIUS = 6378137.0;

// The following value assumes a polar radius of
// const EARTH_POL_RADIUS = 6356752.3;
// The formulate to calculate E2 is
// E2 == (EARTH_EQ_RADIUS^2-EARTH_POL_RADIUS^2)/(EARTH_EQ_RADIUS^2)
// The exact value is used here to avoid rounding errors
export const E2 = 0.00669447819799;

// Cutoff for rounding errors on double calculations
export const EPSILON = 1e-12;


/**
 * Calculates the base 2 logarithm of the given number.
 *
 * @param x A number
 * @returns The base 2 logarithm of a number
 */
function log2(x: number): number {
  return Math.log(x) / Math.log(2);
}

/**
 * Validates the inputted key and throws an error, or returns boolean, if it is invalid.
 *
 * @param key The key to be verified.
 * @param flag Tells function to send up boolean if valid instead of throwing an error.
 */
export function validateKey(key: string, flag = false): boolean {
  let error: string;

  if (typeof key !== 'string') {
    error = 'key must be a string';
  } else if (key.length === 0) {
    error = 'key cannot be the empty string';
  } else if (1 + GEOHASH_PRECISION + key.length > 755) {
    // Firebase can only stored child paths up to 768 characters
    // The child path for this key is at the least: 'i/<geohash>key'
    error = 'key is too long to be stored in Firebase';
  } else if (/[\[\].#$\/\u0000-\u001F\u007F]/.test(key)) {
    // Firebase does not allow node keys to contain the following characters
    error = 'key cannot contain any of the following characters: . # $ ] [ /';
  }

  if (typeof error !== 'undefined' && !flag) {
    throw new Error('Invalid GeoFire key \'' + key + '\': ' + error);
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
export function validateLocation(location: firestore.web.GeoPoint | firestore.cloud.GeoPoint, flag = false): boolean {
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
    throw new Error('Invalid GeoFire location: ' + error);
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
        error = 'geohash cannot contain \'' + letter + '\'';
      }
    }
  }

  if (typeof error !== 'undefined' && !flag) {
    throw new Error('Invalid GeoFire geohash \'' + geohash + '\': ' + error);
  } else {
    return !error;
  }
}

/**
 * Validates the inputted GeoFirestore object and throws an error, or returns boolean, if it is invalid.
 *
 * @param geoFirestoreObj The GeoFirestore object to be validated.
 * @param flag Tells function to send up boolean if valid instead of throwing an error.
 */
export function validateGeoFirestoreObject(geoFirestoreObj: GeoFirestoreObj, flag = false): boolean {
  let error: string;

  error = (!validateGeohash(geoFirestoreObj.g, true)) ? 'invalid geohash on object' : null;
  error = (!validateLocation(geoFirestoreObj.l, true)) ? 'invalid location on object' : error;

  if (!geoFirestoreObj || !('d' in geoFirestoreObj) || typeof geoFirestoreObj.d !== 'object') {
    error = 'no valid document found';
  }

  if (error && !flag) {
    throw new Error('Invalid GeoFirestore object: ' + error);
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
export function validateCriteria(newQueryCriteria: QueryCriteria, requireCenterAndRadius = false): void {
  if (typeof newQueryCriteria !== 'object') {
    throw new Error('QueryCriteria must be an object');
  } else if (typeof newQueryCriteria.center === 'undefined' && typeof newQueryCriteria.radius === 'undefined' && typeof newQueryCriteria.query === 'undefined') {
    throw new Error('radius and/or center must be specified');
  } else if (requireCenterAndRadius && (typeof newQueryCriteria.center === 'undefined' || typeof newQueryCriteria.radius === 'undefined')) {
    throw new Error('QueryCriteria for a new query must contain both a center and a radius');
  } else if (!['[object Function]', '[object Null]', '[object Undefined]'].includes(Object.prototype.toString.call(newQueryCriteria.query))) {
    throw new Error('query of QueryCriteria must be a function');
  }

  // Throw an error if there are any extraneous attributes
  const keys: string[] = Object.keys(newQueryCriteria);
  for (const key of keys) {
    if (!['center', 'radius', 'query'].includes(key)) {
      throw new Error('Unexpected attribute \'' + key + '\' found in query criteria');
    }
  }

  // Validate the 'center' attribute
  if (typeof newQueryCriteria.center !== 'undefined') {
    validateLocation(newQueryCriteria.center);
  }

  // Validate the 'radius' attribute
  if (typeof newQueryCriteria.radius !== 'undefined') {
    if (typeof newQueryCriteria.radius !== 'number' || isNaN(newQueryCriteria.radius)) {
      throw new Error('radius must be a number');
    } else if (newQueryCriteria.radius < 0) {
      throw new Error('radius must be greater than or equal to 0');
    }
  }
}

/**
 * Validates if coordinates are defined in document.
 * @param document A GeoFirestore document.
 * @param customKey A custom keyname that might contain coordinates.
 * @returns True if a location field can be found in the document. 
 */
export function validateDocumentHasCoordinates(document: any, customKey?: string): boolean {

  if (
      (document && typeof document === 'object') // ${document} has to be defined (..in 'object')
      &&                                         // (AND)
      (
        (customKey && customKey in document)     // ${customKey} has to be defined (..in ${document})
        ||                                       // (OR)
        ('coordinates' in document)              // 'coordinates' has to be defined in ${document}
      )
  ) {
      return true;
  }
  return false;
}

/**
 * Converts degrees to radians.
 *
 * @param degrees The number of degrees to be converted to radians.
 * @returns The number of radians equal to the inputted number of degrees.
 */
export function degreesToRadians(degrees: number): number {
  if (typeof degrees !== 'number' || isNaN(degrees)) {
    throw new Error('Error: degrees must be a number');
  }

  return (degrees * Math.PI / 180);
}

/**
 * Generates a geohash of the specified precision/string length from the inputted GeoPoint.
 *
 * @param location The GeoPoint to encode into a geohash.
 * @param precision The length of the geohash to create. If no precision is specified, the
 * global default is used.
 * @returns The geohash of the inputted location.
 */
export function encodeGeohash(location: firestore.web.GeoPoint | firestore.cloud.GeoPoint, precision: number = GEOHASH_PRECISION): string {
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
    max: 90
  };
  const longitudeRange = {
    min: -180,
    max: 180
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
 * Calculates the number of degrees a given distance is at a given latitude.
 *
 * @param distance The distance to convert.
 * @param latitude The latitude at which to calculate.
 * @returns The number of degrees the distance corresponds to.
 */
export function metersToLongitudeDegrees(distance: number, latitude: number): number {
  const radians = degreesToRadians(latitude);
  const num = Math.cos(radians) * EARTH_EQ_RADIUS * Math.PI / 180;
  const denom = 1 / Math.sqrt(1 - E2 * Math.sin(radians) * Math.sin(radians));
  const deltaDeg = num * denom;
  if (deltaDeg < EPSILON) {
    return distance > 0 ? 360 : 0;
  }
  else {
    return Math.min(360, distance / deltaDeg);
  }
}

/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the longitude at a
 * given latitude.
 *
 * @param resolution The desired resolution.
 * @param latitude The latitude used in the conversion.
 * @return The bits necessary to reach a given resolution, in meters.
 */
export function longitudeBitsForResolution(resolution: number, latitude: number): number {
  const degs = metersToLongitudeDegrees(resolution, latitude);
  return (Math.abs(degs) > 0.000001) ? Math.max(1, log2(360 / degs)) : 1;
}

/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the latitude.
 *
 * @param resolution The bits necessary to reach a given resolution, in meters.
 * @returns Bits necessary to reach a given resolution, in meters, for the latitude.
 */
export function latitudeBitsForResolution(resolution: number): number {
  return Math.min(log2(EARTH_MERI_CIRCUMFERENCE / 2 / resolution), MAXIMUM_BITS_PRECISION);
}

/**
 * Wraps the longitude to [-180,180].
 *
 * @param longitude The longitude to wrap.
 * @returns longitude The resulting longitude.
 */
export function wrapLongitude(longitude: number): number {
  if (longitude <= 180 && longitude >= -180) {
    return longitude;
  }
  const adjusted = longitude + 180;
  if (adjusted > 0) {
    return (adjusted % 360) - 180;
  }
  else {
    return 180 - (-adjusted % 360);
  }
}

/**
 * Calculates the maximum number of bits of a geohash to get a bounding box that is larger than a
 * given size at the given coordinate.
 *
 * @param coordinate The coordinate as a Firestore GeoPoint.
 * @param size The size of the bounding box.
 * @returns The number of bits necessary for the geohash.
 */
export function boundingBoxBits(coordinate: firestore.web.GeoPoint | firestore.cloud.GeoPoint, size: number): number {
  const latDeltaDegrees = size / METERS_PER_DEGREE_LATITUDE;
  const latitudeNorth = Math.min(90, coordinate.latitude + latDeltaDegrees);
  const latitudeSouth = Math.max(-90, coordinate.latitude - latDeltaDegrees);
  const bitsLat = Math.floor(latitudeBitsForResolution(size)) * 2;
  const bitsLongNorth = Math.floor(longitudeBitsForResolution(size, latitudeNorth)) * 2 - 1;
  const bitsLongSouth = Math.floor(longitudeBitsForResolution(size, latitudeSouth)) * 2 - 1;
  return Math.min(bitsLat, bitsLongNorth, bitsLongSouth, MAXIMUM_BITS_PRECISION);
}

/**
 * Calculates eight points on the bounding box and the center of a given circle. At least one
 * geohash of these nine coordinates, truncated to a precision of at most radius, are guaranteed
 * to be prefixes of any geohash that lies within the circle.
 *
 * @param center The center given as Firestore GeoPoint.
 * @param radius The radius of the circle.
 * @returns The eight bounding box points.
 */
export function boundingBoxCoordinates(center: firestore.web.GeoPoint | firestore.cloud.GeoPoint, radius: number): firestore.web.GeoPoint[] | firestore.cloud.GeoPoint[] {
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
    toGeoPoint(latitudeSouth, wrapLongitude(center.longitude + longDegs))
  ];
}

/**
 * Calculates the bounding box query for a geohash with x bits precision.
 *
 * @param geohash The geohash whose bounding box query to generate.
 * @param bits The number of bits of precision.
 * @returns A [start, end] pair of geohashes.
 */
export function geohashQuery(geohash: string, bits: number): string[] {
  validateGeohash(geohash);
  const precision = Math.ceil(bits / BITS_PER_CHAR);
  if (geohash.length < precision) {
    return [geohash, geohash + '~'];
  }
  geohash = geohash.substring(0, precision);
  const base = geohash.substring(0, geohash.length - 1);
  const lastValue = BASE32.indexOf(geohash.charAt(geohash.length - 1));
  const significantBits = bits - (base.length * BITS_PER_CHAR);
  const unusedBits = (BITS_PER_CHAR - significantBits);
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
 * Calculates a set of queries to fully contain a given circle. A query is a [start, end] pair
 * where any geohash is guaranteed to be lexiographically larger then start and smaller than end.
 *
 * @param center The center given as a GeoPoint.
 * @param radius The radius of the circle.
 * @return An array of geohashes containing a GeoPoint.
 */
export function geohashQueries(center: firestore.web.GeoPoint | firestore.cloud.GeoPoint, radius: number): string[][] {
  validateLocation(center);
  const queryBits = Math.max(1, boundingBoxBits(center, radius));
  const geohashPrecision = Math.ceil(queryBits / BITS_PER_CHAR);
  const coordinates = boundingBoxCoordinates(center, radius);
  const queries = coordinates.map((coordinate) => {
    return geohashQuery(encodeGeohash(coordinate, geohashPrecision), queryBits);
  });
  // remove duplicates
  return queries.filter((query, index) => {
    return !queries.some((other, otherIndex) => {
      return index > otherIndex && query[0] === other[0] && query[1] === other[1];
    });
  });
}

/**
 * Encodes a location and geohash as a GeoFire object.
 *
 * @param location The location as [latitude, longitude] pair.
 * @param geohash The geohash of the location.
 * @returns The location encoded as GeoFire object.
 */
export function encodeGeoFireObject(location: firestore.web.GeoPoint | firestore.cloud.GeoPoint, geohash: string, document: any): GeoFirestoreObj {
  validateLocation(location);
  validateGeohash(geohash);
  return { g: geohash, l: location, d: document };
}

/**
 * Decodes the document given as GeoFirestore object. Returns null if decoding fails.
 *
 * @param geoFirestoreObj The document encoded as GeoFirestore object.
 * @returns The Firestore document or null if decoding fails.
 */
export function decodeGeoFirestoreObject(geoFirestoreObj: GeoFirestoreObj): any {
  if (validateGeoFirestoreObject(geoFirestoreObj, true)) {
    return geoFirestoreObj.d;
  } else {
    throw new Error('Unexpected location object encountered: ' + JSON.stringify(geoFirestoreObj));
  }
}

/**
 * This function exists because Firestore can update fieldpaths but not nested documents
 *
 * @param geoFireObject Encoded and GeoFire object
 * @returns GeoFire object with obj[d.field] instead of obj.d.field
 * 
 * @summary
 * "With update() you can also use field paths for updating nested values" --Scarygami
 *  
 * We need this because doc['d.fieldname'] = 1; will add/update d.fieldname,
 *  doc.d.fieldnname = 1; will empty doc.d so only doc.d.fieldnname remains
 * 
 * "For set() you always have to provide document-shaped data" --Scarygami
 * 
 *  If we do this than d. is not updated but replaced even if set([..], {merge: true})
 */
export function geoFireDocToFieldPath(geoFireObject: any): GeoFirestoreObj {
  if((typeof (geoFireObject.d !== 'undefined')) &&
     (geoFireObject.d.length !== 0)
    ){
      const document = geoFireObject.d;
      delete geoFireObject.d; 
      Object.keys(document).forEach((key) =>{
          geoFireObject[`d.${key}`] = document[key]; 
      });
    }
  return geoFireObject;
}

/**
 * Returns the id of a Firestore snapshot across SDK versions.
 *
 * @param snapshot A Firestore snapshot.
 * @returns The Firestore snapshot's id.
 */
export function geoFirestoreGetKey(snapshot: firestore.web.DocumentSnapshot | firestore.cloud.DocumentSnapshot): string {
  let id: string;
  if (typeof snapshot.id === 'string' || snapshot.id === null) {
    id = snapshot.id;
  }
  return id;
}

/**
 * Returns the key of a document that is a GeoPoint.
 *
 * @param document A GeoFirestore document.
 * @param customKey A custom keyname that might contain coordinates.
 * @returns The key for the location field of a document. 
 */
export function findCoordinatesKey(document: any, customKey?: string): string {
  let error: string;
  let key: string;

  if (document && typeof document === 'object') {
    if (customKey && customKey in document) {
      key = customKey;
    } else if ('coordinates' in document) {
      key = 'coordinates';
    } else {
      error = 'no valid key exists';
    }
  } else {
    error = 'document not an object';
  }

  if (key && !validateLocation(document[key], true)) {
    error = key + ' is not a valid GeoPoint';
  }

  if (error) {
    throw new Error('Invalid GeoFirestore document: ' + error);
  }

  return key;
}

/**
 * Returns a "GeoPoint." (Kind of fake, but get's the job done!)
 *
 * @param latitude Latitude for GeoPoint.
 * @param longitude Longitude for GeoPoint.
 * @returns Firestore "GeoPoint"
 */
export function toGeoPoint(latitude: number, longitude: number): firestore.web.GeoPoint | firestore.cloud.GeoPoint {
  const fakeGeoPoint: firestore.web.GeoPoint | firestore.cloud.GeoPoint = { latitude, longitude } as firestore.web.GeoPoint | firestore.cloud.GeoPoint;
  validateLocation(fakeGeoPoint);
  return fakeGeoPoint;
}
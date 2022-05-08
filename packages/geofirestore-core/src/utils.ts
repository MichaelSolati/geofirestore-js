import {distance as calcDistance, hash, validateHash} from 'geokit';

import {validateLocation, validateGeoDocument} from './api/validate';
import {GeoFirestoreTypes} from './definitions';

// Characters used in location geohashes
export const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

// Number of bits per geohash character
export const BITS_PER_CHAR = 5;

// Default key for GeoPoint in a Firestore Document.
export const CUSTOM_KEY = 'coordinates';

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
  coordinate:
    | GeoFirestoreTypes.admin.GeoPoint
    | GeoFirestoreTypes.compat.GeoPoint,
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
  center: GeoFirestoreTypes.admin.GeoPoint | GeoFirestoreTypes.compat.GeoPoint,
  radius: number
): GeoFirestoreTypes.admin.GeoPoint[] | GeoFirestoreTypes.compat.GeoPoint[] {
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
 * Function which validates GeoPoints then calculates the distance, in kilometers, between them.
 *
 * @param location1 The GeoPoint of the first location.
 * @param location2 The GeoPoint of the second location.
 * @return The distance, in kilometers, between the inputted locations.
 */
export function calculateDistance(
  location1:
    | GeoFirestoreTypes.admin.GeoPoint
    | GeoFirestoreTypes.compat.GeoPoint,
  location2:
    | GeoFirestoreTypes.admin.GeoPoint
    | GeoFirestoreTypes.compat.GeoPoint
): number {
  validateLocation(location1);
  validateLocation(location2);

  return calcDistance(
    {lat: location1.latitude, lng: location1.longitude},
    {lat: location2.latitude, lng: location2.longitude}
  );
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
  center?: GeoFirestoreTypes.compat.GeoPoint | GeoFirestoreTypes.admin.GeoPoint
): {data: () => GeoFirestoreTypes.GeoDocumentData; distance: number} {
  if (validateGeoDocument(data, true)) {
    const distance = center ? calculateDistance(data.g.geopoint, center) : null;
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
 * Finds GeoPoint in a document.
 *
 * @param document A Firestore document.
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @param flag Tells function supress errors.
 * @return The GeoPoint for the location field of a document.
 */
export function findGeoPoint(
  document: GeoFirestoreTypes.DocumentData,
  customKey?: string,
  flag = false
): GeoFirestoreTypes.compat.GeoPoint | GeoFirestoreTypes.admin.GeoPoint {
  customKey = customKey || CUSTOM_KEY;
  let error: string;
  let geopoint;

  if (customKey in document) {
    geopoint = document[customKey];
  } else {
    const props = customKey.split('.');
    geopoint = document;
    for (const prop of props) {
      if (!(prop in geopoint)) {
        geopoint = document['coordinates'];
        break;
      }
      geopoint = geopoint[prop];
    }
  }

  if (!geopoint) {
    error = 'could not find GeoPoint';
  }

  if (geopoint && !validateLocation(geopoint, true)) {
    error = 'invalid GeoPoint';
  }

  if (error && !flag) {
    throw new Error('Invalid GeoFirestore document: ' + error);
  }

  return geopoint;
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
    | GeoFirestoreTypes.compat.QueryDocumentSnapshot
    | GeoFirestoreTypes.admin.QueryDocumentSnapshot,
  center?: GeoFirestoreTypes.compat.GeoPoint | GeoFirestoreTypes.admin.GeoPoint
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
 * Creates an array of `Query` objects that query the appropriate geohashes based on the radius and center GeoPoint of the query criteria.
 * @param query The Firestore Query instance.
 * @param queryCriteria The query criteria of geo based queries, includes field such as center, radius, and limit.
 * @return Array of Queries to search against.
 */
export function generateQuery(
  query: GeoFirestoreTypes.admin.Query | GeoFirestoreTypes.compat.Query,
  queryCriteria: GeoFirestoreTypes.QueryCriteria
): GeoFirestoreTypes.compat.Query[] {
  // Get the list of geohashes to query
  let geohashesToQuery: string[] = geohashQueries(
    queryCriteria.center,
    queryCriteria.radius * 1000
  ).map(queryToString);
  // Filter out duplicate geohashes
  geohashesToQuery = geohashesToQuery.filter(
    (geohash: string, i: number) => geohashesToQuery.indexOf(geohash) === i
  );

  return geohashesToQuery.map((toQueryStr: string) => {
    // decode the geohash query string
    const queries = stringToQuery(toQueryStr);
    // Create the Firebase query
    return query
      .orderBy('g.geohash')
      .startAt(queries[0])
      .endAt(queries[1]) as GeoFirestoreTypes.compat.Query;
  });
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
  center: GeoFirestoreTypes.admin.GeoPoint | GeoFirestoreTypes.compat.GeoPoint,
  radius: number
): string[][] {
  validateLocation(center);
  const queryBits = Math.max(1, boundingBoxBits(center, radius));
  const geohashPrecision = Math.ceil(queryBits / BITS_PER_CHAR);
  const coordinates:
    | GeoFirestoreTypes.admin.GeoPoint
    | GeoFirestoreTypes.compat.GeoPoint[] = boundingBoxCoordinates(
    center,
    radius
  );
  const queries = coordinates.map(coordinate => {
    return geohashQuery(
      hash(
        {
          lat: coordinate.latitude,
          lng: coordinate.longitude,
        },
        geohashPrecision
      ),
      queryBits
    );
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
  validateHash(geohash);
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
 * Decodes a query string to a query
 *
 * @param str The encoded query.
 * @return The decoded query as a [start, end] pair.
 */
export function stringToQuery(str: string): string[] {
  const decoded: string[] = str.split(':');
  if (decoded.length !== 2) {
    throw new Error(
      'Invalid internal state! Not a valid geohash query: ' + str
    );
  }
  return decoded;
}

/**
 * Encodes a query as a string for easier indexing and equality.
 *
 * @param query The query to encode.
 * @return The encoded query as string.
 */
export function queryToString(query: string[]): string {
  if (query.length !== 2) {
    throw new Error('Not a valid geohash query: ' + query);
  }
  return query[0] + ':' + query[1];
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
): GeoFirestoreTypes.admin.GeoPoint | GeoFirestoreTypes.compat.GeoPoint {
  const fakeGeoPoint:
    | GeoFirestoreTypes.admin.GeoPoint
    | GeoFirestoreTypes.compat.GeoPoint = {latitude, longitude} as
    | GeoFirestoreTypes.admin.GeoPoint
    | GeoFirestoreTypes.compat.GeoPoint;
  validateLocation(fakeGeoPoint);
  return fakeGeoPoint;
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

import * as chai from 'chai';
import firebase from 'firebase/compat/app';
import {hash as geohash} from 'geokit';
import 'firebase/firestore';

import {
  boundingBoxBits,
  boundingBoxCoordinates,
  calculateDistance,
  decodeGeoQueryDocumentSnapshotData,
  degreesToRadians,
  geohashQueries,
  geohashQuery,
  metersToLongitudeDegrees,
  toGeoPoint,
  wrapLongitude,
} from '../src/utils';

import {invalidLocations, validGeoDocumentData, validLocations} from './common';

const expect = chai.expect;

describe('Utils Tests:', () => {
  describe('Bounding box bits:', () => {
    it('boundingBoxBits() must return correct number of bits', () => {
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(35, 0), 1000)
      ).to.be.equal(28);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(35.645, 0), 1000)
      ).to.be.equal(27);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(36, 0), 1000)
      ).to.be.equal(27);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(0, 0), 1000)
      ).to.be.equal(28);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(0, -180), 1000)
      ).to.be.equal(28);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(0, 180), 1000)
      ).to.be.equal(28);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(0, 0), 8000)
      ).to.be.equal(22);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(45, 0), 1000)
      ).to.be.equal(27);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(75, 0), 1000)
      ).to.be.equal(25);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(75, 0), 2000)
      ).to.be.equal(23);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(90, 0), 1000)
      ).to.be.equal(1);
      expect(
        boundingBoxBits(new firebase.firestore.GeoPoint(90, 0), 2000)
      ).to.be.equal(1);
    });
  });

  describe('Bounding box coordinates:', () => {
    it('boundingBoxCoordinates() must return correct set of coordinates', () => {
      expect(
        boundingBoxCoordinates(
          new firebase.firestore.GeoPoint(41.3083, -72.9279),
          1000
        )
      ).to.have.deep.members([
        toGeoPoint(41.3083, -72.9279),
        toGeoPoint(41.3083, -72.93984310002693),
        toGeoPoint(41.3083, -72.91595689997305),
        toGeoPoint(41.31734371732957, -72.9279),
        toGeoPoint(41.31734371732957, -72.93984310002693),
        toGeoPoint(41.31734371732957, -72.91595689997305),
        toGeoPoint(41.299256282670434, -72.9279),
        toGeoPoint(41.299256282670434, -72.93984310002693),
        toGeoPoint(41.299256282670434, -72.91595689997305),
      ]);
    });
  });

  describe('Calculate distance:', () => {
    it('calculateDistance() calculates the distance between locations', () => {
      expect(
        calculateDistance(
          new firebase.firestore.GeoPoint(90, 180),
          new firebase.firestore.GeoPoint(90, 180)
        )
      ).to.be.closeTo(0, 0);
      expect(
        calculateDistance(
          new firebase.firestore.GeoPoint(-90, -180),
          new firebase.firestore.GeoPoint(90, 180)
        )
      ).to.be.closeTo(20015, 1);
      expect(
        calculateDistance(
          new firebase.firestore.GeoPoint(-90, -180),
          new firebase.firestore.GeoPoint(-90, 180)
        )
      ).to.be.closeTo(0, 1);
      expect(
        calculateDistance(
          new firebase.firestore.GeoPoint(-90, -180),
          new firebase.firestore.GeoPoint(90, -180)
        )
      ).to.be.closeTo(20015, 1);
      expect(
        calculateDistance(
          new firebase.firestore.GeoPoint(37.7853074, -122.4054274),
          new firebase.firestore.GeoPoint(78.216667, 15.55)
        )
      ).to.be.closeTo(6818, 1);
      expect(
        calculateDistance(
          new firebase.firestore.GeoPoint(38.98719, -77.250783),
          new firebase.firestore.GeoPoint(29.3760648, 47.9818853)
        )
      ).to.be.closeTo(10531, 1);
      expect(
        calculateDistance(
          new firebase.firestore.GeoPoint(38.98719, -77.250783),
          new firebase.firestore.GeoPoint(-54.933333, -67.616667)
        )
      ).to.be.closeTo(10484, 1);
      expect(
        calculateDistance(
          new firebase.firestore.GeoPoint(29.3760648, 47.9818853),
          new firebase.firestore.GeoPoint(-54.933333, -67.616667)
        )
      ).to.be.closeTo(14250, 1);
      expect(
        calculateDistance(
          new firebase.firestore.GeoPoint(-54.933333, -67.616667),
          new firebase.firestore.GeoPoint(-54, -67)
        )
      ).to.be.closeTo(111, 1);
    });

    it('calculateDistance() does not throw errors given valid locations', () => {
      validLocations().forEach(validLocation => {
        expect(() =>
          calculateDistance(
            validLocation,
            new firebase.firestore.GeoPoint(0, 0)
          )
        ).not.to.throw();
        expect(() =>
          calculateDistance(
            new firebase.firestore.GeoPoint(0, 0),
            validLocation
          )
        ).not.to.throw();
      });
    });

    it('calculateDistance() throws errors given invalid locations', () => {
      invalidLocations().forEach(invalidLocation => {
        expect(() =>
          calculateDistance(invalidLocation, [0, 0] as any)
        ).to.throw();
        expect(() =>
          calculateDistance([0, 0] as any, invalidLocation)
        ).to.throw();
      });
    });
  });

  describe('Decodes GeoQueryDocumentSnapshot data:', () => {
    it('decodeGeoQueryDocumentSnapshotData() returns decoded document with no distance given valid data and no center', () => {
      validGeoDocumentData().forEach(doc => {
        const decoded = decodeGeoQueryDocumentSnapshotData(doc);
        expect(decoded.data()).to.deep.equal(doc);
        expect(decoded.distance).to.equal(null);
      });
    });

    it('decodeGeoQueryDocumentSnapshotData() returns decoded document with distance given valid data and center', () => {
      validGeoDocumentData().forEach(doc => {
        const center = new firebase.firestore.GeoPoint(0, 0);
        const decoded = decodeGeoQueryDocumentSnapshotData(doc, center);
        const distance = calculateDistance(doc.g.geopoint, center);
        expect(decoded.data()).to.deep.equal(doc);
        expect(decoded.distance).to.be.equal(distance);
      });
    });

    it('decodeGeoQueryDocumentSnapshotData() returns original document and no distance given invalid data and no center', () => {
      validGeoDocumentData().forEach(doc => {
        const decoded = decodeGeoQueryDocumentSnapshotData(doc);
        expect(decoded.data()).to.deep.equal(doc);
        expect(decoded.distance).to.equal(null);
      });
    });
  });

  describe('Degrees to radians:', () => {
    it('degreesToRadians() converts degrees to radians', () => {
      expect(degreesToRadians(0)).to.be.closeTo(0, 0);
      expect(degreesToRadians(45)).to.be.closeTo(0.7854, 4);
      expect(degreesToRadians(90)).to.be.closeTo(1.5708, 4);
      expect(degreesToRadians(135)).to.be.closeTo(2.3562, 4);
      expect(degreesToRadians(180)).to.be.closeTo(3.1416, 4);
      expect(degreesToRadians(225)).to.be.closeTo(3.927, 4);
      expect(degreesToRadians(270)).to.be.closeTo(4.7124, 4);
      expect(degreesToRadians(315)).to.be.closeTo(5.4978, 4);
      expect(degreesToRadians(360)).to.be.closeTo(6.2832, 4);
      expect(degreesToRadians(-45)).to.be.closeTo(-0.7854, 4);
      expect(degreesToRadians(-90)).to.be.closeTo(-1.5708, 4);
    });

    it('degreesToRadians() throws errors given invalid inputs', () => {
      expect(() => degreesToRadians('' as any)).to.throw();
      expect(() => degreesToRadians('a' as any)).to.throw();
      expect(() => degreesToRadians(true as any)).to.throw();
      expect(() => degreesToRadians(false as any)).to.throw();
      expect(() => degreesToRadians([1] as any)).to.throw();
      expect(() => degreesToRadians({} as any)).to.throw();
      expect(() => degreesToRadians(null)).to.throw();
      expect(() => degreesToRadians(undefined)).to.throw();
    });
  });

  describe('GeoPoint Generation:', () => {
    it('toGeoPoint() does not throw errors given valid coordinates', () => {
      validLocations().forEach(validLocation => {
        expect(() =>
          toGeoPoint(validLocation.latitude, validLocation.latitude)
        ).not.to.throw();
      });
    });

    it('toGeoPoint() throws errors given invalid coordinates', () => {
      invalidLocations().forEach(invalidLocation => {
        expect(() =>
          toGeoPoint(
            invalidLocation.latitude || 900,
            invalidLocation.latitude || 900
          )
        ).to.throw();
      });
    });
  });

  describe('Coordinate calculations:', () => {
    it('metersToLongtitudeDegrees calculates correctly', () => {
      expect(metersToLongitudeDegrees(1000, 0)).to.be.closeTo(0.008983, 5);
      expect(metersToLongitudeDegrees(111320, 0)).to.be.closeTo(1, 5);
      expect(metersToLongitudeDegrees(107550, 15)).to.be.closeTo(1, 5);
      expect(metersToLongitudeDegrees(96486, 30)).to.be.closeTo(1, 5);
      expect(metersToLongitudeDegrees(78847, 45)).to.be.closeTo(1, 5);
      expect(metersToLongitudeDegrees(55800, 60)).to.be.closeTo(1, 5);
      expect(metersToLongitudeDegrees(28902, 75)).to.be.closeTo(1, 5);
      expect(metersToLongitudeDegrees(0, 90)).to.be.closeTo(0, 5);
      expect(metersToLongitudeDegrees(1000, 90)).to.be.closeTo(360, 5);
      expect(metersToLongitudeDegrees(1000, 89.9999)).to.be.closeTo(360, 5);
      expect(metersToLongitudeDegrees(1000, 89.995)).to.be.closeTo(
        102.594208,
        5
      );
    });

    it('wrapLongitude wraps correctly', () => {
      expect(wrapLongitude(0)).to.be.closeTo(0, 6);
      expect(wrapLongitude(180)).to.be.closeTo(180, 6);
      expect(wrapLongitude(-180)).to.be.closeTo(-180, 6);
      expect(wrapLongitude(182)).to.be.closeTo(-178, 6);
      expect(wrapLongitude(270)).to.be.closeTo(-90, 6);
      expect(wrapLongitude(360)).to.be.closeTo(0, 6);
      expect(wrapLongitude(540)).to.be.closeTo(-180, 6);
      expect(wrapLongitude(630)).to.be.closeTo(-90, 6);
      expect(wrapLongitude(720)).to.be.closeTo(0, 6);
      expect(wrapLongitude(810)).to.be.closeTo(90, 6);
      expect(wrapLongitude(-360)).to.be.closeTo(0, 6);
      expect(wrapLongitude(-182)).to.be.closeTo(178, 6);
      expect(wrapLongitude(-270)).to.be.closeTo(90, 6);
      expect(wrapLongitude(-360)).to.be.closeTo(0, 6);
      expect(wrapLongitude(-450)).to.be.closeTo(-90, 6);
      expect(wrapLongitude(-540)).to.be.closeTo(180, 6);
      expect(wrapLongitude(-630)).to.be.closeTo(90, 6);
      expect(wrapLongitude(1080)).to.be.closeTo(0, 6);
      expect(wrapLongitude(-1080)).to.be.closeTo(0, 6);
    });
  });

  describe('Geohash queries:', () => {
    it('Geohash queries must be of the right size', () => {
      expect(geohashQuery('64m9yn96mx', 6)).to.be.deep.equal(['60', '6h']);
      expect(geohashQuery('64m9yn96mx', 1)).to.be.deep.equal(['0', 'h']);
      expect(geohashQuery('64m9yn96mx', 10)).to.be.deep.equal(['64', '65']);
      expect(geohashQuery('6409yn96mx', 11)).to.be.deep.equal(['640', '64h']);
      expect(geohashQuery('64m9yn96mx', 11)).to.be.deep.equal(['64h', '64~']);
      expect(geohashQuery('6', 10)).to.be.deep.equal(['6', '6~']);
      expect(geohashQuery('64z178', 12)).to.be.deep.equal(['64s', '64~']);
      expect(geohashQuery('64z178', 15)).to.be.deep.equal(['64z', '64~']);
    });

    it('Queries from geohashQueries must contain points in circle', () => {
      function inQuery(queries: any, hash: any) {
        for (let i = 0; i < queries.length; i++) {
          if (hash >= queries[i][0] && hash < queries[i][1]) {
            return true;
          }
        }
        return false;
      }
      for (let i = 0; i < 200; i++) {
        const centerLat = Math.pow(Math.random(), 5) * 160 - 80;
        const centerLong = Math.pow(Math.random(), 5) * 360 - 180;
        const radius = Math.random() * Math.random() * 100000;
        const degreeRadius = metersToLongitudeDegrees(radius, centerLat);
        const queries = geohashQueries(
          new firebase.firestore.GeoPoint(centerLat, centerLong),
          radius
        );
        for (let j = 0; j < 1000; j++) {
          const pointLat = Math.max(
            -89.9,
            Math.min(89.9, centerLat + Math.random() * degreeRadius)
          );
          const pointLong = wrapLongitude(
            centerLong + Math.random() * degreeRadius
          );
          if (
            calculateDistance(
              new firebase.firestore.GeoPoint(centerLat, centerLong),
              new firebase.firestore.GeoPoint(pointLat, pointLong)
            ) <
            radius / 1000
          ) {
            expect(
              inQuery(
                queries,
                geohash({
                  lat: pointLat,
                  lng: pointLong,
                })
              )
            ).to.be.equal(true);
          }
        }
      }
    });
  });
});

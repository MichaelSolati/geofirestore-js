import * as chai from 'chai';
import {hash} from 'geokit';
import {invalidDocumentData, validDocumentData} from './common';
import {
  encodeDocumentAdd,
  encodeDocumentSet,
  encodeDocumentUpdate,
  encodeGeoDocument,
} from '../src/api/encode';

const expect = chai.expect;

describe('Encode Tests:', () => {
  describe('Encode Document Add:', () => {
    it('encodeDocumentAdd() encodes DocumentData with `coordinates` field for GeoPoint', () => {
      validDocumentData().forEach(data => {
        const geohash = hash({
          lat: data.coordinates.latitude,
          lng: data.coordinates.longitude,
        });
        const doc = {
          ...data,
          g: {
            geohash,
            geopoint: data.coordinates,
          },
        };
        expect(encodeDocumentAdd(data)).to.deep.equal(doc);
      });
    });

    it('encodeDocumentAdd() encodes DocumentData with custom field', () => {
      validDocumentData().forEach(data => {
        data.geopoint = data.coordinates;
        delete data.coordinates;
        const geohash = hash({
          lat: data.geopoint.latitude,
          lng: data.geopoint.longitude,
        });
        const doc = {
          ...data,
          g: {
            geohash,
            geopoint: data.geopoint,
          },
        };
        expect(encodeDocumentAdd(data, 'geopoint')).to.deep.equal(doc);
      });
    });

    it('encodeDocumentAdd() throws error with invalid document', () => {
      invalidDocumentData().forEach(data => {
        expect(() => encodeDocumentAdd(data)).to.throw();
      });
    });
  });

  describe('Encode Document Set:', () => {
    it('encodeDocumentSet() encodes DocumentData with `coordinates` field for GeoPoint', () => {
      validDocumentData().forEach(data => {
        const geohash = hash({
          lat: data.coordinates.latitude,
          lng: data.coordinates.longitude,
        });
        const doc = {
          ...data,
          g: {
            geohash,
            geopoint: data.coordinates,
          },
        };
        expect(encodeDocumentSet(data)).to.deep.equal(doc);
      });
    });

    it('encodeDocumentSet() encodes DocumentData with custom field for GeoPoint', () => {
      validDocumentData().forEach(data => {
        data.geopoint = data.coordinates;
        delete data.coordinates;
        const geohash = hash({
          lat: data.geopoint.latitude,
          lng: data.geopoint.longitude,
        });
        const doc = {
          ...data,
          g: {
            geohash,
            geopoint: data.geopoint,
          },
        };
        expect(
          encodeDocumentSet(data, {
            customKey: 'geopoint',
          })
        ).to.deep.equal(doc);
      });
    });

    it('encodeDocumentSet() encodes DocumentData with no GeoPoint', () => {
      validDocumentData().forEach(data => {
        delete data.coordinates;
        expect(encodeDocumentSet(data, {merge: true})).to.deep.equal(data);
      });
    });

    it('encodeDocumentSet() throws error with invalid document', () => {
      invalidDocumentData().forEach(data => {
        expect(() => encodeDocumentSet(data)).to.throw();
      });
    });
  });

  describe('Encode Document Update:', () => {
    it('encodeDocumentUpdate() encodes DocumentData with `coordinates` field for GeoPoint', () => {
      validDocumentData().forEach(data => {
        const geohash = hash({
          lat: data.coordinates.latitude,
          lng: data.coordinates.longitude,
        });
        const doc = {
          ...data,
          g: {
            geohash,
            geopoint: data.coordinates,
          },
        };
        expect(encodeDocumentUpdate(data)).to.deep.equal(doc);
      });
    });

    it('encodeDocumentUpdate() encodes DocumentData with custom field for GeoPoint', () => {
      validDocumentData().forEach(data => {
        data.geopoint = data.coordinates;
        delete data.coordinates;
        const geohash = hash({
          lat: data.geopoint.latitude,
          lng: data.geopoint.longitude,
        });
        const doc = {
          ...data,
          g: {
            geohash,
            geopoint: data.geopoint,
          },
        };
        expect(encodeDocumentUpdate(data, 'geopoint')).to.deep.equal(doc);
      });
    });

    it('encodeDocumentUpdate() encodes DocumentData with no GeoPoint', () => {
      validDocumentData().forEach(data => {
        delete data.coordinates;
        expect(encodeDocumentUpdate(data)).to.deep.equal(data);
      });
    });

    it('encodeDocumentUpdate() throws error with invalid document', () => {
      invalidDocumentData().forEach(data => {
        expect(() => encodeDocumentUpdate(data)).to.throw();
      });
    });
  });

  describe('Encode GeoDocument:', () => {
    it('encodeGeoDocument() encodes GeoPoint and DocumentData to GeoDocument', () => {
      validDocumentData().forEach(data => {
        const geohash = hash({
          lat: data.coordinates.latitude,
          lng: data.coordinates.longitude,
        });
        const doc = {
          ...data,
          g: {
            geohash,
            geopoint: data.coordinates,
          },
        };
        expect(encodeGeoDocument(data.coordinates, data)).to.deep.equal(doc);
      });
    });
  });
});

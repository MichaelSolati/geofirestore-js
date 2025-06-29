import * as chai from 'chai';
import firebase from 'firebase/compat/app';
import {
  invalidDocumentData,
  invalidLocations,
  invalidQueryCriterias,
  validDocumentData,
  validGeoDocumentData,
  validLocations,
  validQueryCriterias,
} from './common';
import {
  validateGeoDocument,
  validateLimit,
  validateLocation,
  validateQueryCriteria,
} from '../src/api/validate';

const expect = chai.expect;

describe('Validate Tests:', () => {
  describe('Validate GeoDocument:', () => {
    it('validateGeoDocument() does not throw errors given valid GeoDocumentData', () => {
      validGeoDocumentData().forEach(valid => {
        expect(() => validateGeoDocument(valid)).not.to.throw();
      });
    });

    it('validateGeoDocument() returns true given valid GeoDocumentData with flag to return boolean enabled', () => {
      validGeoDocumentData().forEach(valid => {
        expect(validateGeoDocument(valid)).to.be.equal(true);
      });
    });

    it('validateGeoDocument() throws errors given invalid GeoDocumentData', () => {
      [...invalidDocumentData(), ...validDocumentData()].forEach(invalid => {
        expect(() => validateGeoDocument(invalid)).to.throw();
      });
      expect(() =>
        validateGeoDocument({
          g: {
            geohash: '7',
            geopoint: {
              latitude: 91,
              longitude: 181,
            } as firebase.firestore.GeoPoint,
          },
        })
      ).to.throw();
      expect(() =>
        validateGeoDocument({
          g: {
            geohash: 'a',
            geopoint: new firebase.firestore.GeoPoint(0, 0),
          },
        })
      ).to.throw();
    });

    it('validateGeoDocument() returns false given invalid GeoDocumentData with flag to return boolean enabled', () => {
      [...invalidDocumentData(), ...validDocumentData()].forEach(invalid => {
        expect(validateGeoDocument(invalid, true)).to.be.equal(false);
      });
    });
  });

  describe('Validate Limit:', () => {
    it('validateLimit() does not throw errors given a number not less than 0', () => {
      [0, 0.1, 1, 500, 30].forEach(valid => {
        expect(() => validateLimit(valid)).not.to.throw();
      });
    });

    it('validateLimit() returns true given a number not less than 0', () => {
      [0, 0.1, 1, 500, 30].forEach(n => {
        expect(validateLimit(n)).to.be.equal(true);
      });
    });

    it('validateLimit() throws errors given a number less than 0', () => {
      [-0.1, -1, -500, -30].forEach(n => {
        expect(() => validateLimit(n)).to.throw();
      });
    });

    it('validateLimit() returns false given a number less than 0 with flag to return boolean enabled', () => {
      [-0.1, -1, -500, -30].forEach(n => {
        expect(validateLimit(n, true)).to.be.equal(false);
      });
    });

    it('validateLimit() throws errors given an invalid argument', () => {
      [it, '50', null, () => {}, {}].forEach(n => {
        expect(() => validateLimit(n as any)).to.throw();
      });
    });

    it('validateLimit() throws error with no arguments', () => {
      // eslint-disable-next-line
      // @ts-ignore
      expect(() => validateLimit()).to.throw();
    });
  });

  describe('Validate Location:', () => {
    it('validateLocation() does not throw errors given valid locations', () => {
      validLocations().forEach(valid => {
        expect(() => validateLocation(valid)).not.to.throw();
      });
    });

    it('validateLocation() returns true given valid locations', () => {
      validLocations().forEach(valid => {
        expect(validateLocation(valid)).to.be.equal(true);
      });
    });

    it('validateLocation() throws errors given invalid locations', () => {
      invalidLocations().forEach(invalid => {
        expect(() => validateLocation(invalid)).to.throw();
      });
    });

    it('validateLocation() returns false given invalid locations with flag to return boolean enabled', () => {
      invalidLocations().forEach(invalid => {
        expect(validateLocation(invalid, true)).to.be.equal(false);
      });
    });
  });

  describe('Validate Query Criteria:', () => {
    it('validateQueryCriteria() does not throw errors given valid query criteria', () => {
      validQueryCriterias().forEach(valid => {
        expect(() => validateQueryCriteria(valid)).not.to.throw();
      });
    });

    it('validateQueryCriteria() throws error only when missing center or radius when `requireCenterAndRadius` flag is enabled', () => {
      validQueryCriterias().forEach(valid => {
        if (
          typeof valid.center === 'undefined' ||
          typeof valid.radius === 'undefined'
        ) {
          expect(() => validateQueryCriteria(valid, true)).to.throw();
        } else {
          expect(() => validateQueryCriteria(valid, true)).not.to.throw();
        }
      });
    });

    it('validateQueryCriteria() throws errors given invalid query criteria', () => {
      invalidQueryCriterias().forEach(invalid => {
        expect(() => validateQueryCriteria(invalid, true)).to.throw();
      });
      expect(() =>
        validateQueryCriteria(
          {center: new firebase.firestore.GeoPoint(0, 0)},
          true
        )
      ).to.throw();
      expect(() => validateQueryCriteria({radius: 1000}, true)).to.throw();
    });
  });
});

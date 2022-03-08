import {expect} from 'chai';
import {GeoPoint, getDoc} from 'firebase/firestore';

import {addDoc} from '../../src/modular/addDoc';

import {
  invalidGeoFirestoreDocuments,
  invalidObjects,
  purge,
  testCollection,
  validDocumentData,
} from './common';

describe('addDoc Tests:', () => {
  beforeEach(purge);

  describe('addDoc():', () => {
    it('addDoc() does not throw an error when given a valid object', () => {
      validDocumentData().forEach(doc => {
        expect(() => addDoc(testCollection, doc)).to.not.throw();
      });
    });

    it('addDoc() does throw an error when given an invalid object', () => {
      invalidGeoFirestoreDocuments.forEach(doc => {
        expect(() => addDoc(testCollection, doc)).to.throw();
      });
    });

    it('addDoc() adds a new object to collection', async () => {
      const d1 = await addDoc(testCollection, {
        coordinates: new GeoPoint(0, 0),
      });
      const d2 = await getDoc(d1);
      expect(d2.exists()).to.be.true;
    });

    it('addDoc() does throw an error when given a non object', () => {
      invalidObjects.forEach(invalidObject => {
        expect(() => addDoc(testCollection, invalidObject)).to.throw();
      });
    });

    it('addDoc() adds a new object with a custom key', async () => {
      const d1 = await addDoc(
        testCollection,
        {geopoint: new GeoPoint(0, 0)},
        'geopoint'
      );
      const d2 = await getDoc(d1);
      expect(d2.exists()).to.be.true;
    });

    it('addDoc() adds a new object with an embedded custom key', async () => {
      const d1 = await addDoc(
        testCollection,
        {geopoint: {coordinates: new GeoPoint(0, 0)}},
        'geopoint.coordinates'
      );
      const d2 = await getDoc(d1);
      expect(d2.exists()).to.be.true;
    });
  });
});

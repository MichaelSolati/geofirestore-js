import {expect} from 'chai';
import {GeoPoint, getDoc, DocumentReference, doc} from 'firebase/firestore';

import {setDoc} from '../../src/modular/setDoc';

import {
  invalidGeoFirestoreDocuments,
  invalidObjects,
  purge,
  testCollection,
  validDocumentData,
} from './common';

let docRef: DocumentReference;

describe('setDoc Tests:', () => {
  beforeEach(done => {
    purge(() => {
      docRef = doc(testCollection, 'testid');
      done();
    });
  });

  describe('setDoc():', () => {
    it('setDoc() does not throw an error when given a valid object', () => {
      validDocumentData().forEach(validDoc => {
        expect(() => setDoc(docRef, validDoc)).to.not.throw();
      });
    });

    it('setDoc() does throw an error when given an invalid object', () => {
      invalidGeoFirestoreDocuments.forEach(validDoc => {
        expect(() => setDoc(docRef, validDoc)).to.throw();
      });
    });

    it('setDoc() adds a new object to collection', async () => {
      await setDoc(docRef, {
        coordinates: new GeoPoint(0, 0),
      });
      const d = await getDoc(docRef);
      expect(d.exists()).to.be.true;
    });

    it('setDoc() does throw an error when given a non object', () => {
      invalidObjects.forEach(invalidObject => {
        expect(() => setDoc(docRef, invalidObject)).to.throw();
      });
    });

    it('setDoc() adds a new object with a custom key', async () => {
      await setDoc(
        docRef,
        {geopoint: new GeoPoint(0, 0)},
        {customKey: 'geopoint'}
      );
      const d = await getDoc(docRef);
      expect(d.exists()).to.be.true;
    });

    it('setDoc() adds a new object with an embedded custom key', async () => {
      await setDoc(
        docRef,
        {geopoint: {coordinates: new GeoPoint(0, 0)}},
        {customKey: 'geopoint.coordinates'}
      );
      const d = await getDoc(docRef);
      expect(d.exists()).to.be.true;
    });
  });
});

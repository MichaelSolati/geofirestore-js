import * as chai from 'chai';

import { GeoFirestore, GeoTransaction } from '../src';
import {
  afterEachHelper, beforeEachHelper, firestore, invalidFirestores,
  testCollectionName, geofirestore, geocollection
} from './common';

const expect = chai.expect;

describe('GeoFirestore Tests:', () => {
  // Reset the Firestore before each test
  beforeEach((done) => {
    beforeEachHelper(done);
  });

  afterEach((done) => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Firestore references', () => {
      invalidFirestores.forEach((invalidFirestore) => {
        // @ts-ignore
        expect(() => new GeoFirestore(invalidFirestore)).to.throw(null, 'Firestore must be an instance of Firestore');
      });
    });

    it('Constructor does not throw errors given valid Firestore reference', () => {
      expect(() => new GeoFirestore(firestore)).not.to.throw();
    });
  });

  describe('batch():', () => {
    it('batch() returns a new GeoWriteBatch based on a Firestore WriteBatch', () => {
      expect((new GeoFirestore(firestore)).batch()['_writeBatch']).to.deep.equal(firestore.batch());
    });
  });

  describe('collection():', () => {
    it('collection() returns a new GeoCollectionReference based on a Firestore CollectionReference', () => {
      expect(
        (new GeoFirestore(firestore)).collection(testCollectionName)['_collection']
      ).to.deep.equal(firestore.collection(testCollectionName));
    });
  });

  describe('runTransaction():', () => {
    it('runTransaction() doesn\'t throw an error when a valid `updateFunction` is passed in', () => {
      expect(() => geofirestore.runTransaction((transaction) => Promise.resolve(true))).to.not.throw();
    });

    it('runTransaction() does throw an error when an invalid `updateFunction` is passed in', (done) => {
      // @ts-ignore
      geofirestore.runTransaction(() => Math).catch((e) => done());
    });
  });
});

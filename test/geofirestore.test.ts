import * as chai from 'chai';

import { GeoFirestore } from '../src/GeoFirestore';
import { afterEachHelper, beforeEachHelper, firestoreRef, invalidFirestores, testCollectionName } from './common';

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
      expect(() => new GeoFirestore(firestoreRef)).not.to.throw();
    });
  });

  describe('batch():', () => {
    it('batch() returns a new GeoWriteBatch based on a Firestore WriteBatch', () => {
      expect((new GeoFirestore(firestoreRef)).batch()['_writeBatch']).to.deep.equal(firestoreRef.batch());
    });
  });

  describe('collection():', () => {
    it('collection() returns a new GeoCollectionReference based on a Firestore CollectionReference', () => {
      expect(
        (new GeoFirestore(firestoreRef)).collection(testCollectionName)['_collection']
      ).to.deep.equal(firestoreRef.collection(testCollectionName));
    });
  });
});

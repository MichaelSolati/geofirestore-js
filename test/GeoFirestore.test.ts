import * as chai from 'chai';
import firebase from 'firebase/app';

import {GeoFirestore} from '../src';
import {
  afterEachHelper,
  beforeEachHelper,
  firestore,
  invalidFirestores,
  testCollectionName,
  geofirestore,
} from './common';

const expect = chai.expect;

describe('GeoFirestore Tests:', () => {
  // Reset the Firestore before each test
  beforeEach(done => {
    beforeEachHelper(done);
  });

  afterEach(done => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Firestore references', () => {
      invalidFirestores.forEach(invalidFirestore => {
        expect(() => new GeoFirestore(invalidFirestore)).to.throw(
          null,
          'Firestore must be an instance of Firestore'
        );
      });
    });

    it('Constructor does not throw errors given valid Firestore reference', () => {
      expect(() => new GeoFirestore(firestore)).not.to.throw();
    });
  });

  describe('native:', () => {
    it('native will return the native Firestore instance', () => {
      const geofirestoreInstance = new GeoFirestore(firestore);
      expect(geofirestoreInstance.native).to.equal(firestore);
    });
  });

  describe('batch():', () => {
    it('batch() returns a new GeoWriteBatch based on a Firestore WriteBatch', () => {
      expect(
        new GeoFirestore(firestore).batch().native instanceof
          firebase.firestore.WriteBatch
      ).to.be.true;
    });
  });

  describe('collection():', () => {
    it('collection() returns a new GeoCollectionReference based on a Firestore CollectionReference', () => {
      expect(
        new GeoFirestore(firestore).collection(testCollectionName).native
      ).to.deep.equal(firestore.collection(testCollectionName));
    });
  });

  describe('collectionGroup():', () => {
    it('collectionGroup() returns a new GeoQuery based on a Firestore Query', () => {
      expect(
        new GeoFirestore(firestore).collectionGroup(testCollectionName).native
      ).to.deep.equal(firestore.collectionGroup(testCollectionName));
    });
  });

  describe('doc():', () => {
    it('doc() returns a new GeoDocumentReference based on a Firestore DocumentReference', () => {
      expect(
        new GeoFirestore(firestore).doc(testCollectionName + '/id1').native
      ).to.deep.equal(firestore.doc(testCollectionName + '/id1'));
    });
  });

  describe('runTransaction():', () => {
    it("runTransaction() doesn't throw an error when a valid `updateFunction` is passed in", () => {
      expect(() =>
        geofirestore.runTransaction(() => Promise.resolve(true))
      ).to.not.throw();
    });

    it('runTransaction() does throw an error when an invalid `updateFunction` is passed in', done => {
      geofirestore.runTransaction(() => Math as any).catch(() => done());
    });
  });
});

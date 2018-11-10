import * as chai from 'chai';

import { GeoFirestore } from '../src/GeoFirestore';
import { GeoQuery } from '../src/GeoQuery';
import { afterEachHelper, beforeEachHelper, collection, dummyData, firestore, invalidFirestores, stubDatabase } from './common';

const expect = chai.expect;

describe('GeoQuery Tests:', () => {
  // Reset the Firestore before each test
  beforeEach((done) => {
    beforeEachHelper(done);
  });

  afterEach((done) => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Firestore Query', () => {
      invalidFirestores.forEach((invalidFirestore) => {
        // @ts-ignore
        expect(() => new GeoQuery(invalidFirestore)).to.throw(null, 'Query must be an instance of a Firestore Query');
      });
    });

    it('Constructor does not throw errors given valid Firestore Query', () => {
      expect(() => new GeoQuery(collection)).not.to.throw();
    });
  });

  describe('firestore:', () => {
    it('firestore returns a new GeoFirestore based on a Firestore of GeoQuery', () => {
      expect((new GeoQuery(collection)).firestore).to.deep.equal(new GeoFirestore(firestore));
    });
  });

  describe('get():', () => {
    it('get() returns dummy data, without any geo related filters', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        query.get().then(data => {
          const result = data.docs.map(d => d.data);
          expect(result).to.have.deep.members(dummyData);
          done();
        });
      });
    });
  });
});

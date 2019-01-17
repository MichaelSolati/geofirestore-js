import * as chai from 'chai';
import * as firebase from 'firebase/app';

import { GeoJoinerOnSnapshot } from '../src/GeoJoinerOnSnapshot';
import {
  afterEachHelper, beforeEachHelper, collection,
  stubDatabase, invalidQueryCriterias, validQueryCriterias, geocollection
} from './common';

const expect = chai.expect;

describe('GeoJoinerOnSnapshot Tests:', () => {
  // Reset the Firestore before each test
  beforeEach((done) => {
    beforeEachHelper(done);
  });

  afterEach((done) => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Query Criteria', (done) => {
      stubDatabase()
        .then(() => {
          invalidQueryCriterias.forEach((criteria) => {
            // @ts-ignore
            expect(() => new GeoJoinerOnSnapshot([collection], criteria, () => { })).to.throw();
          });
        }).then(done);
    });

    it('Constructor does not throw errors given valid arguments', (done) => {
      stubDatabase()
        .then(() => {
          validQueryCriterias.forEach((criteria) => {
            if (criteria.center) {
              expect(() => {
                const joiner = new GeoJoinerOnSnapshot([collection], criteria, () => { }, () => { });
                joiner.unsubscribe()();
              }).not.to.throw();
            }
          });
        }).then(done);
    });
  });

  describe('unsubscribe():', () => {
    it('unsubscribe() stops all updates to function', (done) => {
      stubDatabase()
        .then(() => {
          return new Promise((resolve) => {
            let count = 0;
            let timer;
            const joiner = new GeoJoinerOnSnapshot([collection], validQueryCriterias[0], (da) => {
              if (!timer) {
                joiner.unsubscribe()();
                geocollection.add({ coordinates: validQueryCriterias[0].center });
                timer = setTimeout(() => {
                  expect(count).to.equal(1);
                  resolve();
                }, 5000);
              }
              count++;
            });
          });
        }).then(done);
    });
  });

  describe('Other:', () => {
    it('GeoJoinerOnSnapshot handles error', (done) => {
      stubDatabase()
        .then(() => {
          return new Promise((resolve) => {
            const query = geocollection.where('error', '==', true).near({ center: new firebase.firestore.GeoPoint(0, 0), radius: 1 });
            query.onSnapshot(() => { }, () => resolve());
          });
        }).then(done);
    });
  });
});

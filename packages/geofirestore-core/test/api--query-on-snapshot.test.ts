import * as chai from 'chai';
import {encodeDocumentAdd} from '../src/api/encode';

import {GeoQueryOnSnapshot} from '../src/api/query-on-snapshot';
import {
  afterEachHelper,
  beforeEachHelper,
  collection,
  invalidQueryCriterias,
  stubCollection,
  validQueryCriterias,
} from './common';

const expect = chai.expect;

describe('GeoQueryOnSnapshot Tests:', () => {
  // Reset the Firestore before each test
  beforeEach(done => {
    beforeEachHelper(done);
  });

  afterEach(done => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Query Criteria', done => {
      stubCollection()
        .then(() => {
          invalidQueryCriterias().forEach(criteria => {
            expect(
              () => new GeoQueryOnSnapshot([collection], criteria, () => {})
            ).to.throw();
          });
        })
        .then(done);
    });

    it('Constructor does not throw errors given valid arguments', done => {
      stubCollection()
        .then(() => {
          validQueryCriterias().forEach(criteria => {
            if (criteria.center) {
              expect(() => {
                const instance = new GeoQueryOnSnapshot(
                  [collection],
                  criteria,
                  () => {},
                  () => {}
                );
                instance.unsubscribe()();
              }).not.to.throw();
            }
          });
        })
        .then(done);
    });
  });

  describe('unsubscribe():', () => {
    it('unsubscribe() stops all updates to function', done => {
      stubCollection()
        .then(() => {
          return new Promise(resolve => {
            let count = 0;
            let timer: any;
            const instance = new GeoQueryOnSnapshot(
              [collection],
              validQueryCriterias()[0],
              () => {
                if (!timer) {
                  instance.unsubscribe()();
                  collection.add(
                    encodeDocumentAdd({
                      coordinates: validQueryCriterias()[0].center,
                    })
                  );
                  timer = setTimeout(() => {
                    expect(count).to.equal(1);
                    resolve(null);
                  }, 5000);
                }
                count++;
              }
            );
          });
        })
        .then(done);
    });
  });
});

import * as chai from 'chai';

import {GeoFirestore} from '../src/GeoFirestore';
import {initializeApp, sanitizeSetOptions} from '../src/utils';
import {dummySetOptions, firestore} from './common';

const expect = chai.expect;

describe('Utils Tests:', () => {
  describe('Initialize App:', () => {
    it('initializeApp() returns new instance of GeoFirestore', () => {
      expect(initializeApp(firestore)).to.be.instanceOf(GeoFirestore)
    });
  });

  describe('Sanitize SetOptions:', () => {
    it('sanitizeSetOptions() removes firestore-invalid keys from SetOptions', () => {
      const {merge, mergeFields} = dummySetOptions;
      expect(sanitizeSetOptions(dummySetOptions)).to.deep.equal({
        merge,
        mergeFields,
      });
      expect(sanitizeSetOptions(dummySetOptions).customKey).to.be.equal(
        undefined
      );
    });
  });
});

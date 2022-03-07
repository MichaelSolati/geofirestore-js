import * as chai from 'chai';

import {sanitizeSetOptions} from '../src/utils';
import {dummySetOptions} from './common';

const expect = chai.expect;

describe('Utils Tests:', () => {
  describe('Sanitize SetOptions:', () => {
    it('sanitizeSetOptions() removes firestore-invalid keys from SetOptions', () => {
      const {merge, mergeFields} = dummySetOptions;
      expect(sanitizeSetOptions(dummySetOptions)).to.deep.equal({
        merge,
        mergeFields,
      });
      expect(sanitizeSetOptions(dummySetOptions).customKey).to.be.undefined;
    });
  });
});

import {expect} from 'chai';
import {GeoFirestoreTypes} from 'geofirestore-core';

import {sanitizeSetOptions} from '../src/utils';

// Define dummy setOptions to sanitize
const dummySetOptions: GeoFirestoreTypes.SetOptions = {
  merge: true,
  customKey: 'foobar',
  mergeFields: ['a', 'b'],
};

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

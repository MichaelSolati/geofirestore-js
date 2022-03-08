import {expect} from 'chai';

import {geofirestore, GeoFirestore} from '../../src/compat';
import {firestore} from '../admin/common';

describe('Compat Tests:', () => {
  describe('geofirestore:', () => {
    it('geofirestore() returns new instance of GeoFirestore', () => {
      expect(geofirestore(firestore)).to.be.instanceOf(GeoFirestore);
    });
  });
});

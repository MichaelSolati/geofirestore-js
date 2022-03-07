import * as chai from 'chai';

import {geofirestore, GeoFirestore} from '../../src/compat';
import {firestore} from '../common';

const expect = chai.expect;

describe('Compat Tests:', () => {
  describe('geofirestore:', () => {
    it('geofirestore() returns new instance of GeoFirestore', () => {
      expect(geofirestore(firestore)).to.be.instanceOf(GeoFirestore);
    });
  });
});

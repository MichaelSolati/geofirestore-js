import {expect} from 'chai';
import {doc, GeoPoint, getDoc, getDocs} from 'firebase/firestore';

import {setDoc} from '../../src/modular/setDoc';
import {updateDoc} from '../../src/modular/updateDoc';

import {purge, stubDatabase, testCollection} from './common';

describe('updateDoc Tests:', () => {
  beforeEach(purge);

  describe('updateDoc():', () => {
    it('updateDoc() does not throw an error when given a valid object', async () => {
      await stubDatabase();
      const snapshot = (await getDocs(testCollection)).docs;
      for (let i = 0; i < snapshot.length; i++) {
        const docRef = snapshot[i].ref;
        expect(() => updateDoc(docRef, {i})).to.not.throw();
      }
    });

    it('updateDoc() does throw an error when given an invalid object', async () => {
      await stubDatabase();
      const snapshot = (await getDocs(testCollection)).docs;
      for (let i = 0; i < snapshot.length; i++) {
        const docRef = snapshot[i].ref;
        expect(() => updateDoc(docRef, {i})).to.not.throw();
        expect(() => updateDoc(docRef, null)).to.throw();
        expect(() => updateDoc(docRef, i as any)).to.throw();
        expect(() => updateDoc(docRef, false as any)).to.throw();
      }
    });

    it('updateDoc() updates an existing object in the collection', async () => {
      const docRef = doc(testCollection, 'testid');
      await setDoc(docRef, {coordinates: new GeoPoint(0, 0)});
      await updateDoc(docRef, {key: 1});
      const gottenDoc = await getDoc(docRef);
      expect(gottenDoc.data()).to.deep.equal({
        g: {
          geohash: '7zzzzzzzzz',
          geopoint: new GeoPoint(0, 0),
        },
        coordinates: new GeoPoint(0, 0),
        key: 1,
      });
    });
  });
});

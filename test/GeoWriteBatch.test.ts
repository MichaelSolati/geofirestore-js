import * as chai from 'chai';
import * as firebase from 'firebase/app';

import { GeoFirestore } from '../src/GeoFirestore';
import { GeoWriteBatch } from '../src/GeoWriteBatch';
import {
  afterEachHelper, beforeEachHelper, collection, dummyData, failTestOnCaughtError,
  firestore, geocollection, geofirestore, invalidFirestores, testCollectionName
} from './common';

const expect = chai.expect;

describe('GeoWriteBatch Tests:', () => {
  // Reset the Firestore before each test
  beforeEach((done) => {
    beforeEachHelper(done);
  });

  afterEach((done) => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Firestore WriteBatch', () => {
      invalidFirestores.forEach((invalidFirestore) => {
        // @ts-ignore
        expect(() => new GeoWriteBatch(invalidFirestore)).to.throw(null, 'WriteBatch must be an instance of a Firestore WriteBatch');
      });
    });

    it('Constructor does not throw errors given valid Firestore WriteBatch', () => {
      expect(() => new GeoWriteBatch(firestore.batch())).not.to.throw();
    });
  });

  describe('set():', () => {
    it('set() returns the current GeoWriteBatch given a GeoDocumentReference', () => {
      const geowritebatch = geofirestore.batch();
      const set = geowritebatch.set(geocollection.doc(), dummyData[0]);
      expect(set).to.deep.equal(geowritebatch);
    });

    it('set() without a GeoDocumentReference or DocumentReference, throws an error', () => {
      const geowritebatch = geofirestore.batch();
      failTestOnCaughtError(() => geowritebatch.set(null, {}));
    });

    it('set() successfully adds a document to a collection', () => {
      const doc = geocollection.doc();

      return doc.firestore
        .batch()
        .set(doc, dummyData[0])
        .commit()
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(true);
          expect(snapshot.data()).to.deep.equal(dummyData[0]);
        });
    });

    it('set() can merge documents', () => {
      const doc = geocollection.doc();

      return doc.firestore
        .batch()
        .set(doc, dummyData[0], { merge: true })
        .commit()
        .then(() => {
          return doc.firestore
            .batch()
            .set(doc, { count: 10 }, { merge: true })
            .commit();
        })
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(true);
          expect(snapshot.data()).to.deep.equal({ ...dummyData[0], count: 10 });
        });
    });
  });

  describe('update():', () => {
    it('update() returns the current GeoWriteBatch given a DocumentReference', () => {
      return collection.add(dummyData[0]).then((value) => {
        const geowritebatch = geofirestore.batch();
        const update = geowritebatch.update(value, dummyData[1]);
        expect(update).to.deep.equal(geowritebatch);
      });
    });

    it('update() without a GeoDocumentReference or DocumentReference, throws an error', () => {
      const geowritebatch = geofirestore.batch();
      failTestOnCaughtError(() => geowritebatch.update(null, {}));
    });

    it('update() successfully updates a document in a collection', () => {
      const doc = geocollection.doc();
      return doc
        .set(dummyData[0])
        .then(() =>
          doc.firestore
            .batch()
            .update(doc, dummyData[1])
            .commit()
        )
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(true);
          expect(snapshot.data()).to.deep.equal(dummyData[1]);
        });
    });
  });

  describe('delete():', () => {
    it('delete() returns the current GeoWriteBatch given a GeoDocumentReference', () => {
      const geowritebatch = geofirestore.batch();
      const deleteBatch = geowritebatch.delete(geocollection.doc());
      expect(deleteBatch).to.deep.equal(geowritebatch);
    });

    it('delete() without a GeoDocumentReference or DocumentReference, throws an error', () => {
      const geowritebatch = geofirestore.batch();
      failTestOnCaughtError(() => geowritebatch.delete(null));
    });

    it('delete() successfully deletes a document from a collection', () => {
      const doc = geocollection.doc();
      return doc
        .set(dummyData[0])
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(true);
        })
        .then(() =>
          doc.firestore
            .batch()
            .delete(doc)
            .commit()
        )
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(false);
        });
    });
  });

  describe('collection():', () => {
    it('collection() returns a new GeoCollectionReference based on a Firestore CollectionReference', () => {
      expect(
        (new GeoFirestore(firestore)).collection(testCollectionName)['_collection']
      ).to.deep.equal(firestore.collection(testCollectionName));
    });
  });
});

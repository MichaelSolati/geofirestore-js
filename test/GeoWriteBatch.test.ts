import * as chai from 'chai';
import firebase from 'firebase/app';

import {GeoWriteBatch} from '../src/GeoWriteBatch';
import {
  afterEachHelper,
  beforeEachHelper,
  collection,
  validDocumentData,
  validGeoDocumentData,
  failTestOnCaughtError,
  firestore,
  geocollection,
  geofirestore,
  invalidFirestores,
} from './common';

const expect = chai.expect;

describe('GeoWriteBatch Tests:', () => {
  // Reset the Firestore before each test
  beforeEach(done => {
    beforeEachHelper(done);
  });

  afterEach(done => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Firestore WriteBatch', () => {
      invalidFirestores.forEach(invalidFirestore => {
        expect(() => new GeoWriteBatch(invalidFirestore)).to.throw(
          null,
          'WriteBatch must be an instance of a Firestore WriteBatch'
        );
      });
    });

    it('Constructor does not throw errors given valid Firestore WriteBatch', () => {
      expect(() => new GeoWriteBatch(firestore.batch())).not.to.throw();
    });

    it('Constructor does not throw errors given valid Firestore WriteBatch and custom key', () => {
      expect(
        () => new GeoWriteBatch(firestore.batch(), 'geopoint')
      ).not.to.throw();
    });
  });

  describe('native:', () => {
    it('native will return the native Firestore WriteBatch instance', () => {
      const batch = firestore.batch();
      const geobatch = new GeoWriteBatch(batch);
      expect(geobatch.native).to.equal(batch);
    });
  });

  describe('set():', () => {
    it('set() returns the current GeoWriteBatch given a GeoDocumentReference', () => {
      const geowritebatch = geofirestore.batch();
      const set = geowritebatch.set(
        geocollection.doc(),
        validDocumentData()[0]
      );
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
        .set(doc, validDocumentData()[0])
        .commit()
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(true);
          expect(snapshot.data()).to.deep.equal(validGeoDocumentData()[0]);
        });
    });

    it('set() can merge documents', () => {
      const doc = geocollection.doc();

      return doc.firestore
        .batch()
        .set(doc, validDocumentData()[0], {merge: true})
        .commit()
        .then(() => {
          return doc.firestore
            .batch()
            .set(doc, {count: 10}, {merge: true})
            .commit();
        })
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(true);
          expect(snapshot.data()).to.deep.equal({
            ...validGeoDocumentData()[0],
            count: 10,
          });
        });
    });

    it('set() writes a document to a collection with a custom key', () => {
      const doc = geocollection.doc();
      const docData = validDocumentData()[0];
      docData.geopoint = docData.coordinates;
      delete docData.coordinates;

      return doc.firestore
        .batch()
        .set(doc, docData, {customKey: 'geopoint'})
        .commit()
        .then(() => doc.get())
        .then(snapshot => {
          const expectedData = validGeoDocumentData()[0];
          expectedData.geopoint = expectedData.coordinates;
          delete expectedData.coordinates;

          expect(snapshot.exists).to.equal(true);
          expect(snapshot.data()).to.deep.equal(expectedData);
        });
    });

    it('set() writes a document to a collection with a custom key defined by the write batch', () => {
      const doc = geocollection.doc();
      const docData = validDocumentData()[0];
      docData.geopoint = docData.coordinates;
      delete docData.coordinates;

      return doc.firestore
        .batch('geopoint')
        .set(doc, docData)
        .commit()
        .then(() => doc.get())
        .then(snapshot => {
          const expectedData = validGeoDocumentData()[0];
          expectedData.geopoint = expectedData.coordinates;
          delete expectedData.coordinates;

          expect(snapshot.exists).to.equal(true);
          expect(snapshot.data()).to.deep.equal(expectedData);
        });
    });

    it('set() writes a document to a collection with a custom key and not the custom key defined by the write batch', () => {
      const doc = geocollection.doc();
      const docData = validDocumentData()[0];
      docData.geopoint = docData.coordinates;
      delete docData.coordinates;

      return doc.firestore
        .batch('location')
        .set(doc, docData, {customKey: 'geopoint'})
        .commit()
        .then(() => doc.get())
        .then(snapshot => {
          const expectedData = validGeoDocumentData()[0];
          expectedData.geopoint = expectedData.coordinates;
          delete expectedData.coordinates;

          expect(snapshot.exists).to.equal(true);
          expect(snapshot.data()).to.deep.equal(expectedData);
        });
    });
  });

  describe('update():', () => {
    it('update() returns the current GeoWriteBatch given a DocumentReference', () => {
      return collection.add(validDocumentData()[0]).then(value => {
        const geowritebatch = geofirestore.batch();
        const update = geowritebatch.update(value, validDocumentData()[1]);
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
        .set(validDocumentData()[0])
        .then(() =>
          doc.firestore.batch().update(doc, validDocumentData()[1]).commit()
        )
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(true);
          expect(snapshot.data()).to.deep.equal(validGeoDocumentData()[1]);
        });
    });

    it('update() updates a document to a collection with a custom key', () => {
      const docRef = geocollection.doc();
      const dummyDoc = validDocumentData()[0];
      const geopoint = new firebase.firestore.GeoPoint(0, 0);
      const updateData = {geopoint};

      return docRef
        .set(dummyDoc)
        .then(() =>
          docRef.firestore
            .batch()
            .update(docRef, updateData, 'geopoint')
            .commit()
        )
        .then(() => docRef.get())
        .then(snapshot => {
          const snapshotData = snapshot.data();
          const g = snapshotData.g;
          delete snapshotData.g;
          delete dummyDoc.g;

          expect(snapshot.exists).to.equal(true);
          expect(snapshotData).to.deep.equal({...dummyDoc, geopoint});
          expect(g.geopoint).to.deep.equal(geopoint);
          return Promise.resolve(true);
        });
    });

    it('update() updates a document to a collection with a custom key defined by the write batch', () => {
      const docRef = geocollection.doc();
      const dummyDoc = validDocumentData()[0];
      const geopoint = new firebase.firestore.GeoPoint(0, 0);
      const updateData = {geopoint};

      return docRef
        .set(dummyDoc)
        .then(() =>
          docRef.firestore.batch('geopoint').update(docRef, updateData).commit()
        )
        .then(() => docRef.get())
        .then(snapshot => {
          const snapshotData = snapshot.data();
          const g = snapshotData.g;
          delete snapshotData.g;
          delete dummyDoc.g;

          expect(snapshot.exists).to.equal(true);
          expect(snapshotData).to.deep.equal({...dummyDoc, geopoint});
          expect(g.geopoint).to.deep.equal(geopoint);
          return Promise.resolve(true);
        });
    });

    it('update() updates a document to a collection with a custom key and not the custom key defined by the write batch', () => {
      const docRef = geocollection.doc();
      const dummyDoc = validDocumentData()[0];
      const geopoint = new firebase.firestore.GeoPoint(0, 0);
      const updateData = {geopoint};

      return docRef
        .set(dummyDoc)
        .then(() =>
          docRef.firestore
            .batch('location')
            .update(docRef, updateData, 'geopoint')
            .commit()
        )
        .then(() => docRef.get())
        .then(snapshot => {
          const snapshotData = snapshot.data();
          const g = snapshotData.g;
          delete snapshotData.g;
          delete dummyDoc.g;

          expect(snapshot.exists).to.equal(true);
          expect(snapshotData).to.deep.equal({...dummyDoc, geopoint});
          expect(g.geopoint).to.deep.equal(geopoint);
          return Promise.resolve(true);
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
        .set(validDocumentData()[0])
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(true);
        })
        .then(() => doc.firestore.batch().delete(doc).commit())
        .then(() => doc.get())
        .then(snapshot => {
          expect(snapshot.exists).to.equal(false);
        });
    });
  });
});

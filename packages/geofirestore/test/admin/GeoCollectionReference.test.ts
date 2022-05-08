import {expect} from 'chai';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import {GeoCollectionReference} from '../../src/admin/GeoCollectionReference';
import {GeoDocumentReference} from '../../src/admin/GeoDocumentReference';

import {
  firestore,
  geocollection,
  invalidFirestores,
  invalidGeoFirestoreDocuments,
  invalidObjects,
  purge,
  testCollectionName,
  validDocumentData,
  wait,
} from './common';

describe('GeoCollectionReference Tests:', () => {
  beforeEach(purge);

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Firestore CollectionReference', () => {
      invalidFirestores.forEach(invalidFirestore => {
        expect(() => new GeoCollectionReference(invalidFirestore)).to.throw(
          null,
          'Query must be an instance of a Firestore Query'
        );
      });
    });

    it('Constructor does not throw errors given valid Firestore CollectionReference', () => {
      expect(
        () =>
          new GeoCollectionReference(firestore.collection(testCollectionName))
      ).not.to.throw();
    });

    it('Constructor does not throw errors given valid Firestore CollectionReference and custom key', () => {
      expect(
        () =>
          new GeoCollectionReference(
            firestore.collection(testCollectionName),
            'geopoint'
          )
      ).not.to.throw();
    });
  });

  describe('native:', () => {
    it('native will return the native Firestore CollectionReference instance', () => {
      const collection = firestore.collection(testCollectionName);
      const geoCollection = new GeoCollectionReference(collection);
      expect(geoCollection.native).to.equal(collection);
    });
  });

  describe('id:', () => {
    it('id will the identifier of a Firestore CollectionReference', () => {
      expect(geocollection.id).to.equal(geocollection['_collection'].id);
    });

    it('id will be a sting', () => {
      expect(geocollection.id).to.be.string;
    });
  });

  describe('parent:', () => {
    it('parent will return null if not a subcollection in a document', () => {
      expect(geocollection.parent).to.be.null;
    });

    it('parent will return a GeoDocumentReference if a subcollection in a document', () => {
      return geocollection
        .add({coordinates: new firebase.firestore.GeoPoint(0, 0)})
        .then(doc => {
          const subCollection = doc.collection('subcollection');
          expect(subCollection.parent).to.be.instanceOf(GeoDocumentReference);
          expect(subCollection.parent.isEqual(doc)).to.be.true;
        });
    });
  });

  describe('path:', () => {
    it('path will return path relative to the root of the database', () => {
      expect(geocollection.path).to.equal(testCollectionName);
    });
  });

  describe('add():', () => {
    it('add() does not throw an error when given a valid object', () => {
      validDocumentData().forEach(doc => {
        expect(() => geocollection.add(doc)).to.not.throw();
      });
    });

    it('add() does throw an error when given an invalid object', () => {
      invalidGeoFirestoreDocuments.forEach(doc => {
        expect(() => geocollection.add(doc)).to.throw();
      });
    });

    it('add() adds a new object to collection', () => {
      return geocollection
        .add({coordinates: new firebase.firestore.GeoPoint(0, 0)})
        .then(d1 => {
          return wait(100).then(() => {
            return geocollection
              .doc(d1.id)
              .get()
              .then(d2 => {
                expect(d2.exists).to.be.true;
              });
          });
        });
    });

    it('add() does throw an error when given a non object', () => {
      invalidObjects.forEach(invalidObject => {
        expect(() => geocollection.add(invalidObject)).to.throw();
      });
    });

    it('add() adds a new object with a custom key defined by the collection', () => {
      const geocollectionWithKey = new GeoCollectionReference(
        geocollection.native,
        'geopoint'
      );
      return geocollectionWithKey
        .add({geopoint: new firebase.firestore.GeoPoint(0, 0)})
        .then(d1 => {
          return wait(100).then(() => {
            return geocollectionWithKey
              .doc(d1.id)
              .get()
              .then(d2 => {
                expect(d2.exists).to.be.true;
              });
          });
        });
    });

    it('add() adds a new object using the custom key used during add with a custom key defined by the collection', () => {
      const geocollectionWithKey = new GeoCollectionReference(
        geocollection.native,
        'geopoint'
      );
      return geocollectionWithKey
        .add({location: new firebase.firestore.GeoPoint(0, 0)}, 'location')
        .then(d1 => {
          return wait(100).then(() => {
            return geocollectionWithKey
              .doc(d1.id)
              .get()
              .then(d2 => {
                expect(d2.exists).to.be.true;
              });
          });
        });
    });

    it('add() adds a new object with a custom key', () => {
      return geocollection
        .add({geopoint: new firebase.firestore.GeoPoint(0, 0)}, 'geopoint')
        .then(d1 => {
          return wait(100).then(() => {
            return geocollection
              .doc(d1.id)
              .get()
              .then(d2 => {
                expect(d2.exists).to.be.true;
              });
          });
        });
    });

    it('add() adds a new object with an embedded custom key', () => {
      return geocollection
        .add(
          {geopoint: {coordinates: new firebase.firestore.GeoPoint(0, 0)}},
          'geopoint.coordinates'
        )
        .then(d1 => {
          return wait(100).then(() => {
            return geocollection
              .doc(d1.id)
              .get()
              .then(d2 => {
                expect(d2.exists).to.be.true;
              });
          });
        });
    });
  });

  describe('doc():', () => {
    it('doc() will auto generate an ID if no path is passed', () => {
      const ref = geocollection.doc();
      // Auto IDs are 20 characters long
      expect(ref.id.length).to.equal(20);
    });

    it('doc() will return a GeoDocumentReference when a path is passed', () => {
      return geocollection
        .add({coordinates: new firebase.firestore.GeoPoint(0, 0)})
        .then(doc => {
          expect(geocollection.doc(doc.id)).to.be.instanceOf(
            GeoDocumentReference
          );
          expect(geocollection.doc(doc.id).isEqual(doc)).to.be.true;
        });
    });
  });
});

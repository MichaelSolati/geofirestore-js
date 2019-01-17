import * as chai from 'chai';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { GeoCollectionReference } from '../src/GeoCollectionReference';
import { GeoDocumentReference } from '../src/GeoDocumentReference';
import {
  afterEachHelper, beforeEachHelper, collection, dummyData, geocollection,
  geofirestore, invalidFirestores, invalidObjects, sortObject, stubDatabase
} from './common';

const expect = chai.expect;

describe('GeoDocumentReference Tests:', () => {
  // Reset the Firestore before each test
  beforeEach((done) => {
    beforeEachHelper(done);
  });

  afterEach((done) => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor does not throw errors given valid Firestore DocumentReference', (done) => {
      stubDatabase()
        .then(() => collection.get())
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            expect(() => new GeoDocumentReference(collection.doc(doc.id))).to.not.throw();
          });

        })
        .then(done);
    });

    it('Constructor throws errors given invalid Firestore DocumentReference', () => {
      invalidFirestores.forEach((invalidFirestore) => {
        // @ts-ignore
        expect(() => new GeoDocumentReference(invalidFirestore)).to.throw();
      });
    });
  });

  describe('id:', () => {
    it('id identifier of the document within its collection', (done) => {
      stubDatabase()
        .then(() => collection.get())
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            expect((new GeoDocumentReference(collection.doc(doc.id))).id).to.be.equal(doc.id);
          });

        })
        .then(done);
    });

    it('id will be a sting', (done) => {
      stubDatabase()
        .then(() => collection.get())
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            expect(typeof (new GeoDocumentReference(collection.doc(doc.id))).id).to.equal('string');
          });

        })
        .then(done);
    });
  });

  describe('firestore:', () => {
    it('firestore returns the GeoFirestore for the Firestore database', (done) => {
      stubDatabase()
        .then(() => collection.get())
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            expect(new GeoDocumentReference(collection.doc(doc.id)).firestore).to.deep.equal(geofirestore);
          });
        })
        .then(done);
    });
  });

  describe('onSnapshot:', () => {
    it('onSnapshot returns data', (done) => {
      const documentReference = geocollection.doc('loc1');
      documentReference.set({ coordinates: new firebase.firestore.GeoPoint(0, 0) })
        .then(() => {
          const sub: () => void = documentReference.onSnapshot((snapshot) => {
            sub();
            expect(snapshot.exists).to.equal(true);
            done();
          });
        });
    });

    it('onSnapshot detects change in data', (done) => {
      const documentReference = geocollection.doc('loc1');
      documentReference.set({ key: 1, coordinates: new firebase.firestore.GeoPoint(0, 0) })
        .then(() => {
          let called = false;
          documentReference.onSnapshot((snapshot) => {
            if (snapshot.exists) {
              if (snapshot.data()['key'] === 1) {
                documentReference.set({ key: 2, coordinates: new firebase.firestore.GeoPoint(1, 1) }).then();
              } else if (snapshot.data()['key'] === 2) {
                expect(snapshot.data()).to.deep.equal({ key: 2, coordinates: new firebase.firestore.GeoPoint(1, 1) });
                if (!called) {
                  called = true;
                  done();
                }
              }
            }
          });
        });
    });
  });

  describe('parent:', () => {
    it('parent will return a reference to the GeoCollection to which this GeoDocumentReference belongs', (done) => {
      geocollection.add({ coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(doc => {
        expect(doc.parent).to.be.instanceOf(GeoCollectionReference);
        expect(doc.parent.id).to.be.equal(geocollection.id);
      }).then(done);
    });
  });

  describe('path:', () => {
    it('path will return path relative to the root of the database', (done) => {
      geocollection.add({ coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(doc => {
        expect(doc.path).to.be.equal(geocollection.path + '/' + doc.id);
      }).then(done);
    });
  });

  describe('collection():', () => {
    it('collection() will return a GeoCollectionReference instance that refers to the collection at the specified path', (done) => {
      geocollection.add({ coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(doc => {
        expect(doc.collection(geocollection.path)).to.be.instanceOf(GeoCollectionReference);
        expect(doc.collection(geocollection.path).id).to.be.equal(geocollection.id);
      }).then(done);
    });
  });

  describe('isEqual():', () => {
    it('isEqual() returns true if this GeoDocumentReference is equal to the provided one', (done) => {
      geocollection.doc('loc1').set({ coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        expect(geocollection.doc('loc1').isEqual(geocollection.doc('loc1'))).to.be.equal(true);
        expect(geocollection.doc('loc1').isEqual(collection.doc('loc1'))).to.be.equal(true);
      }).then(done);
    });

    it('isEqual() returns false if this GeoDocumentReference is equal to the provided one', (done) => {
      geocollection.doc('loc1').set({ coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        expect(geocollection.doc('loc1').isEqual(geocollection.doc('loc2'))).to.be.equal(false);
        expect(geocollection.doc('loc1').isEqual(collection.doc('loc2'))).to.be.equal(false);
      }).then(done);
    });
  });

  describe('set():', () => {
    it('set() does not throw an error when given a valid object', () => {
      dummyData.forEach((doc) => {
        expect(() => geocollection.doc(doc.key).set(doc)).to.not.throw();
      });
    });

    it('set() does throw an error when given an invalid object', () => {
      dummyData.forEach((doc) => {
        expect(() => geocollection.doc(doc.key).set(null)).to.throw();
        expect(() => geocollection.doc(doc.key).set({ key: doc.key })).to.throw();
        // @ts-ignore
        expect(() => geocollection.doc(doc.key).set(1)).to.throw();
        // @ts-ignore
        expect(() => geocollection.doc(doc.key).set(false)).to.throw();
      });
    });

    it('set() adds a new object to collection', (done) => {
      const documentReference = geocollection.doc('loc1');
      documentReference.set({ coordinates: new firebase.firestore.GeoPoint(0, 0) })
        .then(() => geocollection.doc('loc1').get())
        .then((doc) => {
          expect(doc.exists).to.equal(true);
        })
        .then(done);
    });

    it('set() does throw an error when given a non object', () => {
      invalidObjects.forEach((invalidObject, index) => {
        // @ts-ignore
        expect(() => geocollection.doc(`loc${index}`).set(invalidObject)).to.throw();
      });
    });
  });

  describe('update():', () => {
    it('update() does not throw an error when given a valid object', (done) => {
      stubDatabase()
        .then(() => geocollection.get())
        .then((snapshot) => {
          const docs = snapshot.docs.map(d => new GeoDocumentReference(collection.doc(d.id)));
          docs.forEach((d, index) => {
            expect(() => d.update({ index })).to.not.throw();
          });
        })
        .then(done);
    });

    it('update() does throw an error when given an ivalid object', (done) => {
      stubDatabase()
        .then(() => geocollection.get())
        .then((snapshot) => {
          const docs = snapshot.docs.map(d => new GeoDocumentReference(collection.doc(d.id)));
          docs.forEach((d, index) => {
            expect(() => d.update(null)).to.throw();
            // @ts-ignore
            expect(() => d.update(index)).to.throw();
            // @ts-ignore
            expect(() => d.update(false)).to.throw();
          });
        })
        .then(done);
    });

    it('update() updates an existing object in the collection', (done) => {
      const documentReference = geocollection.doc('loc1');
      documentReference.set({ coordinates: new firebase.firestore.GeoPoint(0, 0) })
        .then(() => documentReference.update({ key: 1 }))
        .then(() => documentReference.get())
        .then((doc) => {
          expect(sortObject(doc.data())).to.deep.equal(sortObject({ coordinates: new firebase.firestore.GeoPoint(0, 0), key: 1 }));
        })
        .then(done);
    });
  });

  describe('delete():', () => {
    it('delete() will not throw an error when deleting document', (done) => {
      stubDatabase()
        .then(() => geocollection.get())
        .then((snapshot) => {
          const docs = snapshot.docs.map(d => new GeoDocumentReference(collection.doc(d.id)));
          docs.forEach((d) => {
            expect(() => d.delete()).to.not.throw();
          });
        })
        .then(done);
    });

    it('delete() will remove document from collection', (done) => {
      const documentReference = geocollection.doc('loc1');
      documentReference.set({ coordinates: new firebase.firestore.GeoPoint(0, 0) })
        .then(() => documentReference.get())
        .then((doc) => {
          if (!doc.exists) {
            throw new Error('Document doesn\'t exist');
          }
          return documentReference.delete();
        })
        .then(() => documentReference.get())
        .then((doc) => {
          if (doc.exists) {
            throw new Error('Document exist');
          }
        })
        .then(done);
    });
  });

  describe('get():', () => {
    it('get() returns a document', (done) => {
      const documentReference = geocollection.doc('loc1');
      documentReference.set({ coordinates: new firebase.firestore.GeoPoint(0, 0) })
        .then(() => documentReference.get())
        .then((doc) => {
          expect(doc.exists).to.equal(true);
          expect(doc.data()).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });
        })
        .then(done);
    });

    it('get() returns a document, when not on web', (done) => {
      const documentReference = geocollection.doc('loc1');
      documentReference['_isWeb'] = false;
      documentReference.set({ coordinates: new firebase.firestore.GeoPoint(0, 0) })
        .then(() => documentReference.get())
        .then((doc) => {
          expect(doc.exists).to.equal(true);
          expect(doc.data()).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });
        })
        .then(done);
    });

    it('get() returns a document from server (web only)', (done) => {
      const documentReference = geocollection.doc('loc1');
      documentReference.set({ coordinates: new firebase.firestore.GeoPoint(0, 0) })
        .then(() => documentReference.get({ source: 'server' }))
        .then((doc) => {
          expect(doc.exists).to.equal(true);
          expect(doc.data()).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });
        })
        .then(done);
    });

    it('get() doesn\'t returns a document when no document exists', (done) => {
      const documentReference = geocollection.doc('loc1');
      documentReference.get()
        .then((doc) => {
          expect(doc.exists).to.equal(false);
          expect(doc.data()).to.deep.equal(null);
        })
        .then(done);
    });
  });
});

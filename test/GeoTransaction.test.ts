import * as chai from 'chai';
import firebase from 'firebase/app';

import {GeoTransaction} from '../src';
import {
  afterEachHelper,
  beforeEachHelper,
  collection,
  validDocumentData,
  validGeoDocumentData,
  geocollection,
  geofirestore,
  invalidFirestores,
  stubDatabase,
  wait,
} from './common';

const expect = chai.expect;

describe('GeoTransaction Tests:', () => {
  // Reset the Firestore before each test
  beforeEach(done => {
    beforeEachHelper(done);
  });

  afterEach(done => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Firestore Transaction references', () => {
      invalidFirestores.forEach(invalid => {
        expect(() => new GeoTransaction(invalid)).to.throw(
          null,
          'Transaction must be an instance of a Firestore Transaction'
        );
      });
    });

    it('Constructor does not throw errors given valid Firestore Transaction reference', () => {
      expect(() =>
        geofirestore.runTransaction(transaction => {
          new GeoTransaction(transaction);
          return Promise.resolve(true);
        })
      ).not.to.throw();
    });

    it('Constructor does not throw errors given valid Firestore Transaction reference and custom key', () => {
      expect(() =>
        geofirestore.runTransaction(transaction => {
          new GeoTransaction(transaction, 'geopoint');
          return Promise.resolve(true);
        })
      ).not.to.throw();
    });
  });

  describe('native:', () => {
    it('native will return the native Firestore Transaction instance', () => {
      geofirestore.runTransaction(transaction => {
        const geotransaction = new GeoTransaction(transaction);
        expect(geotransaction.native).to.equal(transaction);
        return Promise.resolve(true);
      });
    });
  });

  describe('delete():', () => {
    it('delete() removes a document from a Firestore collection when given a GeoDocumentReference', () => {
      const docRef = geocollection.doc('loc0');
      return stubDatabase().then(() => {
        return geofirestore
          .runTransaction(transaction => {
            const geotransaction = new GeoTransaction(transaction);
            return geotransaction.get(docRef).then(doc => {
              expect(doc.exists).to.be.equal(true);
              geotransaction.delete(docRef);
            });
          })
          .then(() => wait())
          .then(() => docRef.get())
          .then(doc => {
            expect(doc.exists).to.be.equal(false);
            return Promise.resolve(true);
          });
      });
    });

    it('delete() removes a document from a Firestore collection when given a DocumentReference', () => {
      const docRef = collection.doc('loc0');
      return stubDatabase().then(() => {
        return geofirestore
          .runTransaction(transaction => {
            const geotransaction = new GeoTransaction(transaction);
            return geotransaction.get(docRef).then(doc => {
              expect(doc.exists).to.be.equal(true);
              geotransaction.delete(docRef);
            });
          })
          .then(() => wait())
          .then(() => docRef.get())
          .then(doc => {
            expect(doc.exists).to.be.equal(false);
            return Promise.resolve(true);
          });
      });
    });
  });

  describe('get():', () => {
    it('get() reads a document from a Firestore collection when given a GeoDocumentReference', () => {
      const dummyDoc = validGeoDocumentData()[0];
      const docRef = geocollection.doc('loc0');
      return stubDatabase().then(() => {
        return geofirestore.runTransaction(transaction => {
          const geotransaction = new GeoTransaction(transaction);
          return geotransaction.get(docRef).then(doc => {
            expect(doc.exists).to.be.equal(true);
            expect(doc.data()).to.deep.equal(dummyDoc);
            geotransaction.update(docRef, dummyDoc);
          });
        });
      });
    });

    it('get() reads a document from a Firestore collection when given a DocumentReference', () => {
      const dummyDoc = validGeoDocumentData()[0];
      const docRef = collection.doc('loc0');
      return stubDatabase().then(() => {
        return geofirestore.runTransaction(transaction => {
          const geotransaction = new GeoTransaction(transaction);
          return geotransaction.get(docRef).then(doc => {
            expect(doc.exists).to.be.equal(true);
            expect(doc.data()).to.deep.equal(dummyDoc);
            geotransaction.update(docRef, dummyDoc);
          });
        });
      });
    });
  });

  describe('set():', () => {
    it('set() writes to a document from a Firestore collection when given a GeoDocumentReference', () => {
      const dummyDoc = validGeoDocumentData()[0];
      const dummyDoc2 = validGeoDocumentData()[1];
      const docRef = geocollection.doc('loc0');
      return stubDatabase().then(() => {
        return geofirestore
          .runTransaction(transaction => {
            const geotransaction = new GeoTransaction(transaction);
            return geotransaction.get(docRef).then(doc => {
              expect(doc.exists).to.be.equal(true);
              expect(doc.data()).to.deep.equal(dummyDoc);
              geotransaction.set(docRef, dummyDoc2);
            });
          })
          .then(() => wait())
          .then(() => docRef.get())
          .then(doc => {
            expect(doc.exists).to.be.equal(true);
            expect(doc.data()).to.deep.equal(dummyDoc2);
            return Promise.resolve(true);
          });
      });
    });

    it('set() writes to a document from a Firestore collection when given a DocumentReference', () => {
      const dummyDoc = validGeoDocumentData()[0];
      const dummyDoc2 = validGeoDocumentData()[1];
      const docRef = collection.doc('loc0');
      return stubDatabase().then(() => {
        return geofirestore
          .runTransaction(transaction => {
            const geotransaction = new GeoTransaction(transaction);
            return geotransaction.get(docRef).then(doc => {
              expect(doc.exists).to.be.equal(true);
              expect(doc.data()).to.deep.equal(dummyDoc);
              geotransaction.set(docRef, dummyDoc2);
            });
          })
          .then(() => wait())
          .then(() => docRef.get())
          .then(doc => {
            expect(doc.exists).to.be.equal(true);
            expect(doc.data()).to.deep.equal(dummyDoc2);
            return Promise.resolve(true);
          });
      });
    });

    it('set() creates a new document if no document existed before', () => {
      const dummyDoc = validGeoDocumentData()[0];
      const docRef = geocollection.doc('loc0');
      return geofirestore
        .runTransaction(transaction => {
          const geotransaction = new GeoTransaction(transaction);
          return geotransaction.get(docRef).then(doc => {
            expect(doc.exists).to.be.equal(false);
            geotransaction.set(docRef, dummyDoc);
          });
        })
        .then(() => wait())
        .then(() => docRef.get())
        .then(doc => {
          expect(doc.exists).to.be.equal(true);
          expect(doc.data()).to.deep.equal(dummyDoc);
          return Promise.resolve(true);
        });
    });

    it('set() writes document with a custom key', () => {
      const docRef = geocollection.doc('loc0');
      const dummyDoc = validDocumentData()[0];
      dummyDoc.geopoint = dummyDoc.coordinates;
      delete dummyDoc.coordinates;

      return geofirestore
        .runTransaction(transaction => {
          const geotransaction = new GeoTransaction(transaction);
          return geotransaction.get(docRef).then(doc => {
            expect(doc.exists).to.be.equal(false);
            geotransaction.set(docRef, dummyDoc, {customKey: 'geopoint'});
          });
        })
        .then(() => wait())
        .then(() => docRef.get())
        .then(doc => {
          const docData = doc.data();
          delete docData.g;
          expect(doc.exists).to.be.equal(true);
          expect(docData).to.deep.equal(dummyDoc);
          return Promise.resolve(true);
        });
    });

    it('set() writes document with a custom key defined by the transaction', () => {
      const docRef = geocollection.doc('loc0');
      const dummyDoc = validDocumentData()[0];
      dummyDoc.geopoint = dummyDoc.coordinates;
      delete dummyDoc.coordinates;

      return geofirestore
        .runTransaction(transaction => {
          const geotransaction = new GeoTransaction(transaction, 'geopoint');
          return geotransaction.get(docRef).then(doc => {
            expect(doc.exists).to.be.equal(false);
            geotransaction.set(docRef, dummyDoc);
          });
        })
        .then(() => wait())
        .then(() => docRef.get())
        .then(doc => {
          const docData = doc.data();
          delete docData.g;
          expect(doc.exists).to.be.equal(true);
          expect(docData).to.deep.equal(dummyDoc);
          return Promise.resolve(true);
        });
    });

    it('set() writes document with a custom key and not the custom key defined by the transaction', () => {
      const docRef = geocollection.doc('loc0');
      const dummyDoc = validDocumentData()[0];
      dummyDoc.location = dummyDoc.coordinates;
      delete dummyDoc.coordinates;

      return geofirestore
        .runTransaction(transaction => {
          const geotransaction = new GeoTransaction(transaction, 'geopoint');
          return geotransaction.get(docRef).then(doc => {
            expect(doc.exists).to.be.equal(false);
            geotransaction.set(docRef, dummyDoc, {customKey: 'location'});
          });
        })
        .then(() => wait())
        .then(() => docRef.get())
        .then(doc => {
          const docData = doc.data();
          delete docData.g;
          expect(doc.exists).to.be.equal(true);
          expect(docData).to.deep.equal(dummyDoc);
          return Promise.resolve(true);
        });
    });
  });

  describe('update():', () => {
    it('update() writes to a document from a Firestore collection when given a GeoDocumentReference', () => {
      const dummyDoc = validGeoDocumentData()[0];
      const dummyDoc2 = validGeoDocumentData()[1];
      const docRef = geocollection.doc('loc0');
      return stubDatabase().then(() => {
        return geofirestore
          .runTransaction(transaction => {
            const geotransaction = new GeoTransaction(transaction);
            return geotransaction.get(docRef).then(doc => {
              expect(doc.exists).to.be.equal(true);
              expect(doc.data()).to.deep.equal(dummyDoc);
              geotransaction.update(docRef, dummyDoc2);
            });
          })
          .then(() => wait())
          .then(() => docRef.get())
          .then(doc => {
            expect(doc.exists).to.be.equal(true);
            expect(doc.data()).to.deep.equal(dummyDoc2);
            return Promise.resolve(true);
          });
      });
    });

    it('update() writes to a document from a Firestore collection when given a DocumentReference', () => {
      const dummyDoc = validGeoDocumentData()[0];
      const dummyDoc2 = validGeoDocumentData()[1];
      const docRef = collection.doc('loc0');
      return stubDatabase().then(() => {
        return geofirestore
          .runTransaction(transaction => {
            const geotransaction = new GeoTransaction(transaction);
            return geotransaction.get(docRef).then(doc => {
              expect(doc.exists).to.be.equal(true);
              expect(doc.data()).to.deep.equal(dummyDoc);
              geotransaction.update(docRef, dummyDoc2);
            });
          })
          .then(() => wait())
          .then(() => docRef.get())
          .then(doc => {
            expect(doc.exists).to.be.equal(true);
            expect(doc.data()).to.deep.equal(dummyDoc2);
            return Promise.resolve(true);
          });
      });
    });

    it('update() fails if no document existed before', () => {
      const dummyDoc = validGeoDocumentData()[0];
      const docRef = geocollection.doc('loc0');
      let isDone = false;
      return geofirestore
        .runTransaction(transaction => {
          const geotransaction = new GeoTransaction(transaction);
          return geotransaction.get(docRef).then(doc => {
            expect(doc.exists).to.be.equal(false);
            geotransaction.update(docRef, dummyDoc);
          });
        })
        .catch(e => {
          expect(e).to.not.be.equal(null);
          expect(e).to.not.be.equal(undefined);
          if (!isDone) {
            isDone = true;
          }

          return Promise.resolve(isDone);
        });
    });

    it('update() updates document with a custom key', () => {
      const docRef = geocollection.doc('loc0');
      const dummyDoc = validGeoDocumentData()[0];
      const geopoint = new firebase.firestore.GeoPoint(0, 0);
      const updateData = {geopoint};

      return stubDatabase().then(() => {
        return geofirestore
          .runTransaction(transaction => {
            const geotransaction = new GeoTransaction(transaction);
            return geotransaction.get(docRef).then(doc => {
              expect(doc.exists).to.be.equal(true);
              expect(doc.data()).to.deep.equal(dummyDoc);
              geotransaction.update(docRef, updateData, 'geopoint');
            });
          })
          .then(() => wait())
          .then(() => docRef.get())
          .then(doc => {
            const docData = doc.data();
            const g = docData.g;
            delete docData.g;
            delete dummyDoc.g;

            expect(doc.exists).to.be.equal(true);
            expect(docData).to.deep.equal({...dummyDoc, geopoint});
            expect(g.geopoint).to.deep.equal(geopoint);
            return Promise.resolve(true);
          });
      });
    });

    it('update() updates document with a custom key defined by the transaction', () => {
      const docRef = geocollection.doc('loc0');
      const dummyDoc = validGeoDocumentData()[0];
      const geopoint = new firebase.firestore.GeoPoint(0, 0);
      const updateData = {geopoint};

      return stubDatabase().then(() => {
        return geofirestore
          .runTransaction(transaction => {
            const geotransaction = new GeoTransaction(transaction, 'geopoint');
            return geotransaction.get(docRef).then(doc => {
              expect(doc.exists).to.be.equal(true);
              expect(doc.data()).to.deep.equal(dummyDoc);
              geotransaction.update(docRef, updateData);
            });
          })
          .then(() => wait())
          .then(() => docRef.get())
          .then(doc => {
            const docData = doc.data();
            const g = docData.g;
            delete docData.g;
            delete dummyDoc.g;

            expect(doc.exists).to.be.equal(true);
            expect(docData).to.deep.equal({...dummyDoc, geopoint});
            expect(g.geopoint).to.deep.equal(geopoint);
            return Promise.resolve(true);
          });
      });
    });

    it('update() updates document with a custom key and not the custom key defined by the transaction', () => {
      const docRef = geocollection.doc('loc0');
      const dummyDoc = validGeoDocumentData()[0];
      const geopoint = new firebase.firestore.GeoPoint(0, 0);
      const updateData = {geopoint};

      return stubDatabase().then(() => {
        return geofirestore
          .runTransaction(transaction => {
            const geotransaction = new GeoTransaction(transaction, 'location');
            return geotransaction.get(docRef).then(doc => {
              expect(doc.exists).to.be.equal(true);
              expect(doc.data()).to.deep.equal(dummyDoc);
              geotransaction.update(docRef, updateData, 'geopoint');
            });
          })
          .then(() => wait())
          .then(() => docRef.get())
          .then(doc => {
            const docData = doc.data();
            const g = docData.g;
            delete docData.g;
            delete dummyDoc.g;

            expect(doc.exists).to.be.equal(true);
            expect(docData).to.deep.equal({...dummyDoc, geopoint});
            expect(g.geopoint).to.deep.equal(geopoint);
            return Promise.resolve(true);
          });
      });
    });
  });
});

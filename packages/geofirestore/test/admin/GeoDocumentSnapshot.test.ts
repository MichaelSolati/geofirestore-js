import {expect} from 'chai';

import {GeoDocumentSnapshot} from '../../src/admin/GeoDocumentSnapshot';
import {GeoDocumentReference} from '../../src/admin/GeoDocumentReference';

import {
  collection,
  geocollection,
  invalidFirestores,
  purge,
  stubDatabase,
  validGeoDocumentData,
} from './common';

describe('GeoDocumentSnapshot Tests:', () => {
  beforeEach(purge);

  describe('Constructor:', () => {
    it('Constructor does not throw errors given valid Firestore DocumentSnapshot', done => {
      stubDatabase()
        .then(() => collection.doc('loc0').get())
        .then(snapshot => {
          expect(() => new GeoDocumentSnapshot(snapshot)).to.not.throw();
        })
        .then(done);
    });

    it('Constructor throws errors given invalid Firestore DocumentSnapshot', () => {
      invalidFirestores.forEach(invalid => {
        expect(() => new GeoDocumentSnapshot(invalid)).to.throw();
      });
    });
  });

  describe('native:', () => {
    it('native will return the native Firestore DocumentSnapshot instance', done => {
      stubDatabase()
        .then(() => collection.doc('loc0').get())
        .then(snapshot => {
          const geodocumentsnapshot = new GeoDocumentSnapshot(snapshot);
          expect(geodocumentsnapshot.native).to.equal(snapshot);
        })
        .then(done);
    });
  });

  describe('exists:', () => {
    it('exists returns true if document exists', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          expect(snapshot.exists).to.be.true;
        })
        .then(done);
    });

    it('exists returns false if document does not exists', done => {
      geocollection
        .doc('loc0')
        .get()
        .then(snapshot => {
          expect(snapshot.exists).to.be.false;
        })
        .then(done);
    });
  });

  describe('id:', () => {
    it('id will be a sting', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          expect(snapshot.id).to.be.string;
        })
        .then(done);
    });

    it('id returned matches id of doc', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          expect(snapshot.id).to.equal('loc0');
        })
        .then(done);
    });
  });

  describe('ref:', () => {
    it('ref returns a GeoDocumentReference', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          expect(snapshot.ref).to.be.instanceOf(GeoDocumentReference);
        })
        .then(done);
    });

    it('ref returns a GeoDocumentReference of the selected document', done => {
      let geoQuerySnapshot: any;
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => (geoQuerySnapshot = snapshot))
        .then(() => collection.doc('loc0').get())
        .then(snapshot => {
          expect(geoQuerySnapshot.ref.isEqual(snapshot.ref)).to.be.true;
        })
        .then(done);
    });
  });

  describe('data():', () => {
    it('data() returns document', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          expect(snapshot.data()).to.deep.equal(validGeoDocumentData()[0]);
        })
        .then(done);
    });

    it('data() returns document when given SnapshotOptions', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          expect(snapshot.data({serverTimestamps: 'estimate'})).to.deep.equal(
            validGeoDocumentData()[0]
          );
        })
        .then(done);
    });

    it('data() does not throw error when given SnapshotOptions', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          expect(() =>
            snapshot.data({serverTimestamps: 'estimate'})
          ).to.not.throw();
        })
        .then(done);
    });
  });

  describe('get():', () => {
    it('get() returns field of document', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          Object.getOwnPropertyNames(validGeoDocumentData()[0]).forEach(
            property => {
              expect(snapshot.get(property)).to.deep.equal(
                validGeoDocumentData()[0][property]
              );
            }
          );
        })
        .then(done);
    });

    it('get() returns field of document when given SnapshotOptions', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          Object.getOwnPropertyNames(validGeoDocumentData()[0]).forEach(
            property => {
              expect(
                snapshot.get(property, {serverTimestamps: 'estimate'})
              ).to.deep.equal(validGeoDocumentData()[0][property]);
            }
          );
        })
        .then(done);
    });

    it('get() does not throw error when given SnapshotOptions', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          Object.getOwnPropertyNames(validGeoDocumentData()[0]).forEach(
            property => {
              expect(() =>
                snapshot.get(property, {serverTimestamps: 'estimate'})
              ).to.not.throw();
            }
          );
        })
        .then(done);
    });
  });

  describe('isEqual:', () => {
    it('isEqual() returns true when given corresponding DocumentSnapshot', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          expect(snapshot.isEqual(snapshot['_snapshot'])).to.be.true;
        })
        .then(done);
    });

    it('isEqual() returns true when given same GeoDocumentSnapshot', done => {
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => {
          expect(snapshot.isEqual(snapshot)).to.be.true;
        })
        .then(done);
    });

    it('isEqual() returns false when given non-corresponding DocumentSnapshot', done => {
      let snapshotDoc0: any;
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => (snapshotDoc0 = snapshot))
        .then(() => collection.doc('loc1').get())
        .then(snapshot => {
          expect(snapshotDoc0.isEqual(snapshot)).to.be.false;
        })
        .then(done);
    });

    it('isEqual() returns false when given different GeoDocumentSnapshot', done => {
      let snapshotDoc0: any;
      stubDatabase()
        .then(() => geocollection.doc('loc0').get())
        .then(snapshot => (snapshotDoc0 = snapshot))
        .then(() => geocollection.doc('loc1').get())
        .then(snapshot => {
          expect(snapshotDoc0.isEqual(snapshot)).to.be.false;
        })
        .then(done);
    });
  });
});

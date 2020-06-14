import * as chai from 'chai';
import * as firebase from 'firebase/app';

import {GeoQuerySnapshot} from '../src/GeoQuerySnapshot';
import {
  afterEachHelper,
  beforeEachHelper,
  collection,
  validGeoDocumentData,
  invalidFirestores,
  stubDatabase,
} from './common';
import {calculateDistance} from '../src/utils';

const expect = chai.expect;

describe('GeoQuerySnapshot Tests:', () => {
  // Reset the Firestore before each test
  beforeEach(done => {
    beforeEachHelper(done);
  });

  afterEach(done => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor does not throw errors given valid Firestore QuerySnapshot', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          expect(() => new GeoQuerySnapshot(snapshot)).to.not.throw();
        })
        .then(done);
    });

    it('Constructor does not throw errors given valid Firestore QuerySnapshot and center', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          expect(
            () =>
              new GeoQuerySnapshot(
                snapshot,
                new firebase.firestore.GeoPoint(0, 0)
              )
          ).to.not.throw();
        })
        .then(done);
    });

    it('Constructor throws errors given invalid Firestore QuerySnapshot', () => {
      invalidFirestores.forEach(invalid => {
        expect(() => new GeoQuerySnapshot(invalid)).to.throw();
      });
    });

    it('Constructor throws errors given valid Firestore QuerySnapshot and an invalid center', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          expect(() => new GeoQuerySnapshot(snapshot, {} as any)).to.throw();
        })
        .then(done);
    });
  });

  describe('docs:', () => {
    it('docs returns an array of all documents in the GeoQuerySnapshot', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          const docs = new GeoQuerySnapshot(snapshot).docs;
          const results = docs.map(d => {
            d.data = d.data();
            return d;
          });
          expect(results).to.have.deep.members(
            validGeoDocumentData.map((data, index) => ({
              exists: true,
              id: `loc${index}`,
              data,
              distance: null,
            }))
          );
        })
        .then(done);
    });

    it('docs returns an array of all documents with distance in the GeoQuerySnapshot', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          const center = new firebase.firestore.GeoPoint(2, 5);
          const docs = new GeoQuerySnapshot(snapshot, center).docs;
          const results = docs.map(d => {
            d.data = d.data();
            return d;
          });
          expect(results).to.have.deep.members(
            validGeoDocumentData.map((data, index) => ({
              exists: true,
              id: `loc${index}`,
              data,
              distance: calculateDistance(data.g.geopoint, center),
            }))
          );
        })
        .then(done);
    });
  });

  describe('size:', () => {
    it('size returns the number of documents in the GeoQuerySnapshot', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          const size = new GeoQuerySnapshot(snapshot).size;
          expect(size).to.equal(validGeoDocumentData.length);
        })
        .then(done);
    });

    it('size returns 0 when no documents are in the GeoQuerySnapshot', done => {
      collection
        .get()
        .then(snapshot => {
          const size = new GeoQuerySnapshot(snapshot).size;
          expect(size).to.equal(0);
        })
        .then(done);
    });
  });

  describe('empty:', () => {
    it('empty returns false when documents are in the GeoQuerySnapshot', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          const empty = new GeoQuerySnapshot(snapshot).empty;
          expect(empty).to.equal(false);
        })
        .then(done);
    });

    it('empty returns true when documents are not in the GeoQuerySnapshot', done => {
      collection
        .get()
        .then(snapshot => {
          const empty = new GeoQuerySnapshot(snapshot).empty;
          expect(empty).to.equal(true);
        })
        .then(done);
    });
  });

  describe('docChanges():', () => {
    it('docChanges() returns an array of all documents, with changes like their index, in the GeoQuerySnapshot', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          const docChanges = new GeoQuerySnapshot(snapshot).docChanges();
          const results = docChanges.map((d, index) => {
            expect(d.type).to.equal('added');
            expect(d.newIndex).to.equal(index);
            expect(d.oldIndex).to.equal(-1);
            return d.doc.data();
          });
          expect(results).to.have.deep.members(validGeoDocumentData);
        })
        .then(done);
    });
  });

  describe('forEach():', () => {
    it('forEach() enumerates all of the documents in the GeoQuerySnapshot', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          new GeoQuerySnapshot(snapshot).forEach(result =>
            expect(result).to.not.equal(null)
          );
        })
        .then(done);
    });
  });
});

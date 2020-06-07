import * as chai from 'chai';
import * as firebase from 'firebase/app';

import {GeoQuerySnapshot} from '../src/GeoQuerySnapshot';
import {
  afterEachHelper,
  beforeEachHelper,
  collection,
  dummyData,
  invalidFirestores,
  stubDatabase,
} from './common';

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
          expect(results).to.have.deep.members([
            {
              exists: true,
              id: 'loc1',
              data: {
                key: 'loc1',
                coordinates: new firebase.firestore.GeoPoint(2, 3),
                count: 0,
              },
              distance: null,
            },
            {
              exists: true,
              id: 'loc2',
              data: {
                key: 'loc2',
                coordinates: new firebase.firestore.GeoPoint(50, -7),
                count: 1,
              },
              distance: null,
            },
            {
              exists: true,
              id: 'loc3',
              data: {
                key: 'loc3',
                coordinates: new firebase.firestore.GeoPoint(16, -150),
                count: 2,
              },
              distance: null,
            },
            {
              exists: true,
              id: 'loc4',
              data: {
                key: 'loc4',
                coordinates: new firebase.firestore.GeoPoint(5, 5),
                count: 3,
              },
              distance: null,
            },
            {
              exists: true,
              id: 'loc5',
              data: {
                key: 'loc5',
                coordinates: new firebase.firestore.GeoPoint(67, 55),
                count: 4,
              },
              distance: null,
            },
            {
              exists: true,
              id: 'loc6',
              data: {
                key: 'loc6',
                coordinates: new firebase.firestore.GeoPoint(8, 8),
                count: 5,
              },
              distance: null,
            },
          ]);
        })
        .then(done);
    });

    it('docs returns an array of all documents with distance in the GeoQuerySnapshot', done => {
      stubDatabase()
        .then(() => collection.get())
        .then(snapshot => {
          const docs = new GeoQuerySnapshot(
            snapshot,
            new firebase.firestore.GeoPoint(2, 5)
          ).docs;
          const results = docs.map(d => {
            d.data = d.data();
            return d;
          });
          expect(results).to.have.deep.members([
            {
              exists: true,
              id: 'loc1',
              data: {
                key: 'loc1',
                coordinates: new firebase.firestore.GeoPoint(2, 3),
                count: 0,
              },
              distance: 222.25436565425878,
            },
            {
              exists: true,
              id: 'loc2',
              data: {
                key: 'loc2',
                coordinates: new firebase.firestore.GeoPoint(50, -7),
                count: 1,
              },
              distance: 5456.704194046366,
            },
            {
              exists: true,
              id: 'loc3',
              data: {
                key: 'loc3',
                coordinates: new firebase.firestore.GeoPoint(16, -150),
                count: 2,
              },
              distance: 16616.361524616907,
            },
            {
              exists: true,
              id: 'loc4',
              data: {
                key: 'loc4',
                coordinates: new firebase.firestore.GeoPoint(5, 5),
                count: 3,
              },
              distance: 333.58477993367615,
            },
            {
              exists: true,
              id: 'loc5',
              data: {
                key: 'loc5',
                coordinates: new firebase.firestore.GeoPoint(67, 55),
                count: 4,
              },
              distance: 8178.7138331874385,
            },
            {
              exists: true,
              id: 'loc6',
              data: {
                key: 'loc6',
                coordinates: new firebase.firestore.GeoPoint(8, 8),
                count: 5,
              },
              distance: 745.2820170595751,
            },
          ]);
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
          expect(size).to.equal(dummyData.length);
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
          expect(results).to.have.deep.members(dummyData);
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

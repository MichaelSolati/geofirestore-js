import * as chai from 'chai';
import * as firebase from 'firebase/app';

import { GeoFirestore } from '../src/GeoFirestore';
import { GeoQuery } from '../src/GeoQuery';
import {
  afterEachHelper, beforeEachHelper, collection, dummyData,
  firestore, invalidFirestores, stubDatabase, invalidLocations, geocollection
} from './common';

const expect = chai.expect;

describe('GeoQuery Tests:', () => {
  // Reset the Firestore before each test
  beforeEach((done) => {
    beforeEachHelper(done);
  });

  afterEach((done) => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Firestore Query', () => {
      invalidFirestores.forEach((invalidFirestore) => {
        // @ts-ignore
        expect(() => new GeoQuery(invalidFirestore)).to.throw(null, 'Query must be an instance of a Firestore Query');
      });
    });

    it('Constructor does not throw errors given valid Firestore Query', () => {
      expect(() => new GeoQuery(collection)).not.to.throw();
    });
  });

  describe('firestore:', () => {
    it('firestore returns a new GeoFirestore based on a Firestore of GeoQuery', () => {
      expect((new GeoQuery(collection)).firestore).to.deep.equal(new GeoFirestore(firestore));
    });
  });

  describe('onSnapshot:', () => {
    it('onSnapshot returns dummy data, without any geo related filters', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        const subscription = query.onSnapshot((snapshot) => {
          if (snapshot.size === dummyData.length) {
            subscription();
            const result = snapshot.docs.map(d => d.data());
            expect(result).to.have.deep.members(dummyData);
            done();
          }
        });
      });
    });

    it('onSnapshot returns dummy data, without any geo related filters and with a `where` statement', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        const subscription = query.where('count', '>', 2).onSnapshot((snapshot) => {
          subscription();
          const result = snapshot.docs.map(d => d.data());
          expect(result).to.have.deep.members([
            { key: 'loc4', coordinates: new firebase.firestore.GeoPoint(5, 5), count: 3 },
            { key: 'loc5', coordinates: new firebase.firestore.GeoPoint(67, 55), count: 4 },
            { key: 'loc6', coordinates: new firebase.firestore.GeoPoint(8, 8), count: 5 },
          ]);
          done();
        });
      });
    });

    it('onSnapshot returns dummy data, with geo related filters', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        const subscription = query.near({ center: new firebase.firestore.GeoPoint(1, 2), radius: 1000 }).onSnapshot((snapshot) => {
          subscription();
          const result = snapshot.docs.map(d => d.data());
          expect(result).to.have.deep.members([
            { key: 'loc1', coordinates: new firebase.firestore.GeoPoint(2, 3), count: 0 },
            { key: 'loc4', coordinates: new firebase.firestore.GeoPoint(5, 5), count: 3 },
          ]);
          done();
        });
      });
    });

    it('onSnapshot returns no data, with geo related filters on an empty area', (done) => {
      const center = new firebase.firestore.GeoPoint(-50, -50);
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        const subscription = query.near({ center, radius: 1 }).onSnapshot((snapshot) => {
          subscription();
          expect(snapshot.empty).to.equal(true);
          done();
        });
      });
    });

    it('onSnapshot updates when a new document, that matches the query, is added to collection', (done) => {
      const center = new firebase.firestore.GeoPoint(-50, -50);
      const doc = geocollection.doc();
      let runOnce = false;
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        const subscription = query.near({ center, radius: 1 }).onSnapshot((snapshot) => {
          if (!runOnce) {
            runOnce = true;
            setTimeout(() => {
              doc.set({ coordinates: center });
            }, 100);
          } else {
            subscription();
            const result = snapshot.docs.map(d => d.data());
            expect(result).to.have.deep.members([{ coordinates: center }]);
            done();
          }
        });
      });
    });

    it('onSnapshot updates when a document, that belongs in the query, is removed from collection', (done) => {
      const doc = dummyData[0];
      let runOnce = false;
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        const subscription = query.near({ center: doc.coordinates, radius: 0.1 }).onSnapshot((snapshot) => {
          if (!runOnce) {
            runOnce = true;
            expect(snapshot.empty).to.equal(false);
            expect(snapshot.docChanges().length).to.equal(1);
            expect(snapshot.docChanges()[0].type).to.equal('added');
            setTimeout(() => {
              geocollection.doc(doc.key).delete();
            }, 100);
          } else {
            subscription();
            expect(snapshot.empty).to.equal(true);
            expect(snapshot.docChanges().length).to.equal(1);
            expect(snapshot.docChanges()[0].type).to.equal('removed');
            done();
          }
        });
      });
    });
  });

  describe('get():', () => {
    it('get() returns dummy data, without any geo related filters', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase()
        .then(() => query.get())
        .then((data) => {
          const result = data.docs.map(d => d.data());
          expect(result).to.have.deep.members(dummyData);
        })
        .then(done);
    });

    it('get() returns dummy data, without any geo related filters and with a `where` statement', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        query.where('count', '>', 2).get().then((snapshot) => {
          const result = snapshot.docs.map(d => d.data());
          expect(result).to.have.deep.members([
            { key: 'loc4', coordinates: new firebase.firestore.GeoPoint(5, 5), count: 3 },
            { key: 'loc5', coordinates: new firebase.firestore.GeoPoint(67, 55), count: 4 },
            { key: 'loc6', coordinates: new firebase.firestore.GeoPoint(8, 8), count: 5 },
          ]);
          done();
        });
      });
    });

    it('get() returns dummy data, with geo related filters', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        query.near({ center: new firebase.firestore.GeoPoint(1, 2), radius: 1000 }).get().then((snapshot) => {
          const result = snapshot.docs.map(d => d.data());
          expect(result).to.have.deep.members([
            { key: 'loc1', coordinates: new firebase.firestore.GeoPoint(2, 3), count: 0 },
            { key: 'loc4', coordinates: new firebase.firestore.GeoPoint(5, 5), count: 3 },
          ]);
          done();
        });
      });
    });

    it('get() returns dummy data, when not on web', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        query['_isWeb'] = false;
        query.get().then(data => {
          const result = data.docs.map(d => d.data());
          expect(result).to.have.deep.members(dummyData);
          done();
        });
      });
    });

    it('get() returns dummy data, with geo related filters, when not on web', (done) => {
      let query = new GeoQuery(collection);
      stubDatabase().then(() => {
        query = query.near({ center: new firebase.firestore.GeoPoint(1, 2), radius: 1000 });
        query['_isWeb'] = false;
        query.get().then((snapshot) => {
          const result = snapshot.docs.map(d => d.data());
          expect(result).to.have.deep.members([
            { key: 'loc1', coordinates: new firebase.firestore.GeoPoint(2, 3), count: 0 },
            { key: 'loc4', coordinates: new firebase.firestore.GeoPoint(5, 5), count: 3 },
          ]);
          done();
        });
      });
    });

    it('get() returns dummy data from server (web only)', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        query.get({ source: 'server' }).then(data => {
          const result = data.docs.map(d => d.data());
          expect(result).to.have.deep.members(dummyData);
          done();
        });
      });
    });

    it('get() returns dummy data, with geo related filters from server (web only)', (done) => {
      const query = new GeoQuery(collection);
      stubDatabase().then(() => {
        query.near({ center: new firebase.firestore.GeoPoint(1, 2), radius: 1000 }).get({ source: 'server' }).then((snapshot) => {
          const result = snapshot.docs.map(d => d.data());
          expect(result).to.have.deep.members([
            { key: 'loc1', coordinates: new firebase.firestore.GeoPoint(2, 3), count: 0 },
            { key: 'loc4', coordinates: new firebase.firestore.GeoPoint(5, 5), count: 3 },
          ]);
          done();
        });
      });
    });
  });

  describe('near():', () => {
    it('near() does not throw an error with valid arguments', () => {
      const query = new GeoQuery(collection);
      expect(() => query.near({ center: new firebase.firestore.GeoPoint(0, 0), radius: 100 })).not.to.throw();
      expect(() => query.near({ center: new firebase.firestore.GeoPoint(1, 1) })).not.to.throw();
      expect(() => query.near({ radius: 500 })).not.to.throw();
    });

    it('near() throws error with no arguments', () => {
      const query = new GeoQuery(collection);
      // @ts-ignore
      expect(() => query.near()).to.throw();
    });

    it('near() throws error with invalid arguments', () => {
      const query = new GeoQuery(collection);
      // @ts-ignore
      expect(() => query.near({})).to.throw();
      invalidLocations.forEach((loc) => {
        // @ts-ignore
        expect(() => query.near({ center: loc, radius: loc })).to.throw();
        // @ts-ignore
        expect(() => query.near({ center: loc })).to.throw();
        // @ts-ignore
        expect(() => query.near({ radius: loc })).to.throw();
      });
    });
  });

  describe('where():', () => {
    it('where() does not throw an error with valid arguments', () => {
      const query = new GeoQuery(collection);
      expect(() => query.where('count', '>', '2')).not.to.throw();
    });

    it('where() throws error with no arguments', () => {
      const query = new GeoQuery(collection);
      // @ts-ignore
      expect(() => query.where()).to.throw();
    });

    it('where() throws error with invalid arguments', () => {
      const query = new GeoQuery(collection);
      // @ts-ignore
      expect(() => query.where('count', 'as', 12)).to.throw();
    });
  });


  describe('near().where():', () => {
    it('near().where() does not throw an error with valid arguments', () => {
      const query = new GeoQuery(collection);
      expect(() => query.near({ center: new firebase.firestore.GeoPoint(0, 0), radius: 100 })
                        .where('count', '==', 0)).not.to.throw();
      expect(() => query.near({ center: new firebase.firestore.GeoPoint(1, 1) })
                        .where('count', '>', 0)).not.to.throw();
      expect(() => query.near({ radius: 500 })
                        .where('count', '<=', 0)).not.to.throw();
      expect(() => query.near({ radius: 500 })
                        .where('array', 'array-contains', 'one')).not.to.throw();
    });
  });


  describe('_stringToQuery():', () => {
    it('_stringToQuery() returns an array of two string elements', () => {
      const query = new GeoQuery(collection);
      expect(query['_stringToQuery']('0:z')).to.have.deep.members(['0', 'z']);
    });

    it('_stringToQuery() throws error with invalid argument', () => {
      const query = new GeoQuery(collection);
      // @ts-ignore
      expect(() => query['_stringToQuery']('0z')).to.throw();
    });
  });

  describe('_queryToString():', () => {
    it('_queryToString() returns an array of two string elements', () => {
      const query = new GeoQuery(collection);
      expect(query['_queryToString'](['0', 'z'])).to.equal('0:z');
    });

    it('_queryToString() throws error with invalid argument', () => {
      const query = new GeoQuery(collection);
      // @ts-ignore
      expect(() => query['_queryToString']('0', 'z', 'a')).to.throw();
    });
  });
});

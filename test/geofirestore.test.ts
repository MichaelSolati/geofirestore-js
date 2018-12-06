import * as chai from 'chai';
import * as firebase from 'firebase';

import { GeoFirestore, GeoFirestoreQuery } from '../src';
import {
  afterEachHelper, beforeEachHelper, Checklist, failTestOnCaughtError, geoFirestore, geoFirestoreRef, getFirestoreData, geoFirestoreQueries,
  invalidFirebaseRefs, invalidKeys, invalidLocations, invalidObjects, invalidQueryCriterias, validKeys, validLocations, validQueryCriterias
} from './common';

const expect = chai.expect;

describe('GeoFirestore Tests:', () => {
  // Reset the Firestore before each test
  beforeEach((done) => {
    beforeEachHelper(done);
  });

  afterEach((done) => {
    afterEachHelper(done);
  });

  describe('Constructor:', () => {
    it('Constructor throws errors given invalid Firestore Collection references', () => {
      invalidFirebaseRefs.forEach((invalidFirebaseRef) => {
        // @ts-ignore
        expect(() => new GeoFirestore(invalidFirebaseRef)).to.throw(null, 'collectionRef must be an instance of a Firestore Collection');
      });
    });

    it('Constructor does not throw errors given valid Firestore Collection references', () => {
      expect(() => new GeoFirestore(geoFirestoreRef)).not.to.throw();
    });
  });

  describe('ref():', () => {
    it('ref() returns the Firestore Collection reference used to create a GeoFire instance', () => {
      expect(geoFirestore.ref()).to.deep.equal(geoFirestoreRef);
    });
  });

  describe('Adding a single document via add():', () => {
    it('add() returns a promise', (done) => {

      const cl = new Checklist(['p1'], expect, done);

      geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');
      });
    });

    it('add() updates Firebase when adding new documents', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4'], expect, done);

      geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(50, 50) });
      }).then(() => {
        cl.x('p2');

        return geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(-90, -90) });
      }).then(() => {
        cl.x('p3');

        return getFirestoreData();
      }).then((firebaseData) => {
        firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);
        expect(firebaseData).to.have.deep.members([
          { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { 'coordinates': new firebase.firestore.GeoPoint(0, 0) } },
          { 'l': new firebase.firestore.GeoPoint(50, 50), 'g': 'v0gs3y0zh7', 'd': { 'coordinates': new firebase.firestore.GeoPoint(50, 50) } },
          { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { 'coordinates': new firebase.firestore.GeoPoint(-90, -90) } },
        ]);

        cl.x('p4');
      }).catch((error) => {
        failTestOnCaughtError(error);
      });
    });

    it('add() handles decimal latitudes and longitudes', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4'], expect, done);

      geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(0.254, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(50, 50.293403) });
      }).then(() => {
        cl.x('p2');

        return geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938) });
      }).then(() => {
        cl.x('p3');

        return getFirestoreData();
      }).then((firebaseData) => {
        firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);
        expect(firebaseData).to.have.deep.members([
          { 'l': new firebase.firestore.GeoPoint(0.254, 0), 'g': 'ebpcrypzxv', 'd': { coordinates: new firebase.firestore.GeoPoint(0.254, 0) } },
          { 'l': new firebase.firestore.GeoPoint(50, 50.293403), 'g': 'v0gu2qnx15', 'd': { coordinates: new firebase.firestore.GeoPoint(50, 50.293403) } },
          { 'l': new firebase.firestore.GeoPoint(-82.614, -90.938), 'g': '1cr648sfx4', 'd': { coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938) } },
        ]);

        cl.x('p4');
      }).catch(failTestOnCaughtError);
    });

    it('add() handles custom fields for coordinates', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5'], expect, done);

      geoFirestore.add({ location: new firebase.firestore.GeoPoint(0, 0) }, 'location').then(() => {
        cl.x('p1');

        return geoFirestore.add({ place: new firebase.firestore.GeoPoint(50, 50) }, 'place');
      }).then(() => {
        cl.x('p2');

        return geoFirestore.add({ coord: new firebase.firestore.GeoPoint(-90, -90) }, 'coord');
      }).then(() => {
        cl.x('p3');

        return geoFirestore.add({ hotGeofire: new firebase.firestore.GeoPoint(2, 3) }, 'hotGeofire');
      }).then(() => {
        cl.x('p4');

        return getFirestoreData();
      }).then((firebaseData) => {
        firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);
        expect(firebaseData).to.have.deep.members([
          { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { location: new firebase.firestore.GeoPoint(0, 0) } },
          { 'l': new firebase.firestore.GeoPoint(50, 50), 'g': 'v0gs3y0zh7', 'd': { place: new firebase.firestore.GeoPoint(50, 50) } },
          { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { coord: new firebase.firestore.GeoPoint(-90, -90) } },
          { 'l': new firebase.firestore.GeoPoint(2, 3), 'g': 's065kk0dc5', 'd': { hotGeofire: new firebase.firestore.GeoPoint(2, 3) } }
        ]);

        cl.x('p5');
      }).catch(failTestOnCaughtError);
    });

    it('add() handles multiple insertions at the same location', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4'], expect, done);

      geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(0, 0) });
      }).then(() => {
        cl.x('p2');

        return geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(0, 0) });
      }).then(() => {
        cl.x('p3');

        return getFirestoreData();
      }).then((firebaseData) => {
        firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);
        expect(firebaseData).to.have.deep.members([
          { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } },
          { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } },
          { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } }
        ]);

        cl.x('p4');
      }).catch(failTestOnCaughtError);
    });

    it('add() throws errors given invalid custom location keys', () => {
      expect(() => {
        geoFirestore.add({ invalidKey: new firebase.firestore.GeoPoint(0, 0) });
      }).to.throw();

      expect(() => {
        geoFirestore.add({ invalidKey: new firebase.firestore.GeoPoint(0, 0) }, 'coord');
      }).to.throw();
    });

    it('add() does not throw errors given valid locations', () => {
      validLocations.forEach((validLocation) => {
        expect(() => {
          geoFirestore.add({ coordinates: validLocation });
        }).not.to.throw();
      });
    });

    it('add() throws errors given invalid locations', () => {
      invalidLocations.forEach((invalidLocation) => {
        expect(() => {
          geoFirestore.add({ coordinates: invalidLocation });
        }).to.throw(Error, /Invalid GeoFirestore document/);
      });
    });

    it('add() throws errors given invalid objects', () => {
      invalidObjects.forEach((invalidObject) => {
        expect(() => {
          geoFirestore.add(invalidObject);
        }).to.throw(Error, /document must be an object/);
      });
    });
  });

  describe('Adding a single document via set():', () => {
    it('set() returns a promise', (done) => {

      const cl = new Checklist(['p1'], expect, done);

      geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');
      });
    });

    it('set() updates Firebase when adding new locations', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4'], expect, done);

      geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.set('loc2', { coordinates: new firebase.firestore.GeoPoint(50, 50) });
      }).then(() => {
        cl.x('p2');

        return geoFirestore.set('loc3', { coordinates: new firebase.firestore.GeoPoint(-90, -90) });
      }).then(() => {
        cl.x('p3');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { 'coordinates': new firebase.firestore.GeoPoint(0, 0) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(50, 50), 'g': 'v0gs3y0zh7', 'd': { 'coordinates': new firebase.firestore.GeoPoint(50, 50) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { 'coordinates': new firebase.firestore.GeoPoint(-90, -90) } },
        });

        cl.x('p4');
      }).catch((error) => {
        failTestOnCaughtError(error);
      });
    });

    it('set() handles decimal latitudes and longitudes', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4'], expect, done);

      geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(0.254, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.set('loc2', { coordinates: new firebase.firestore.GeoPoint(50, 50.293403) });
      }).then(() => {
        cl.x('p2');

        return geoFirestore.set('loc3', { coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938) });
      }).then(() => {
        cl.x('p3');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0.254, 0), 'g': 'ebpcrypzxv', 'd': { coordinates: new firebase.firestore.GeoPoint(0.254, 0) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(50, 50.293403), 'g': 'v0gu2qnx15', 'd': { coordinates: new firebase.firestore.GeoPoint(50, 50.293403) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(-82.614, -90.938), 'g': '1cr648sfx4', 'd': { coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938) } },
        });

        cl.x('p4');
      }).catch(failTestOnCaughtError);
    });

    it('set() updates Firebase when changing a pre-existing key', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5'], expect, done);

      geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.set('loc2', { coordinates: new firebase.firestore.GeoPoint(50, 50) });
      }).then(() => {
        cl.x('p2');

        return geoFirestore.set('loc3', { coordinates: new firebase.firestore.GeoPoint(-90, -90) });
      }).then(() => {
        cl.x('p3');

        return geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(2, 3) });
      }).then(() => {
        cl.x('p4');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': {
            'l': new firebase.firestore.GeoPoint(2, 3), 'g': 's065kk0dc5', 'd': {
              coordinates: new firebase.firestore.GeoPoint(2, 3)
            }
          },
          'loc2': { 'l': new firebase.firestore.GeoPoint(50, 50), 'g': 'v0gs3y0zh7', 'd': { coordinates: new firebase.firestore.GeoPoint(50, 50) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { coordinates: new firebase.firestore.GeoPoint(-90, -90) } }
        });

        cl.x('p5');
      }).catch(failTestOnCaughtError);
    });

    it('set() updates Firebase when changing a pre-existing key to the same location', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5'], expect, done);

      geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.set('loc2', { coordinates: new firebase.firestore.GeoPoint(50, 50) });
      }).then(() => {
        cl.x('p2');

        return geoFirestore.set('loc3', { coordinates: new firebase.firestore.GeoPoint(-90, -90) });
      }).then(() => {
        cl.x('p3');

        return geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(0, 0) });
      }).then(() => {
        cl.x('p4');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(50, 50), 'g': 'v0gs3y0zh7', 'd': { coordinates: new firebase.firestore.GeoPoint(50, 50) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { coordinates: new firebase.firestore.GeoPoint(-90, -90) } }
        });

        cl.x('p5');
      }).catch(failTestOnCaughtError);
    });

    it('set() handles multiple keys at the same location', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4'], expect, done);

      geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.set('loc2', { coordinates: new firebase.firestore.GeoPoint(0, 0) });
      }).then(() => {
        cl.x('p2');

        return geoFirestore.set('loc3', { coordinates: new firebase.firestore.GeoPoint(0, 0) });
      }).then(() => {
        cl.x('p3');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } }
        });

        cl.x('p4');
      }).catch(failTestOnCaughtError);
    });

    it('set() updates Firebase after complex operations', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'], expect, done);

      geoFirestore.set('loc:1', { coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.set('loc2', { coordinates: new firebase.firestore.GeoPoint(50, 50) });
      }).then(() => {
        cl.x('p2');

        return geoFirestore.set('loc%!A72f()3', { coordinates: new firebase.firestore.GeoPoint(-90, -90) });
      }).then(() => {
        cl.x('p3');

        return geoFirestore.remove('loc2');
      }).then(() => {
        cl.x('p4');

        return geoFirestore.set('loc2', { coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621) });
      }).then(() => {
        cl.x('p5');

        return geoFirestore.set('loc4', { coordinates: new firebase.firestore.GeoPoint(87.6, -130) });
      }).then(() => {
        cl.x('p6');

        return geoFirestore.set('loc5', { coordinates: new firebase.firestore.GeoPoint(5, 55.555) });
      }).then(() => {
        cl.x('p7');

        return geoFirestore.set('loc5', null);
      }).then(() => {
        cl.x('p8');

        return geoFirestore.set('loc:1', { coordinates: new firebase.firestore.GeoPoint(87.6, -130) });
      }).then(() => {
        cl.x('p9');

        return geoFirestore.set('loc6', { coordinates: new firebase.firestore.GeoPoint(-72.258, 0.953215) });
      }).then(() => {
        cl.x('p10');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc:1': { 'l': new firebase.firestore.GeoPoint(87.6, -130), 'g': 'cped3g0fur', 'd': { coordinates: new firebase.firestore.GeoPoint(87.6, -130) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(0.2358, -72.621), 'g': 'd2h376zj8h', 'd': { coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621) } },
          'loc%!A72f()3': { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { coordinates: new firebase.firestore.GeoPoint(-90, -90) } },
          'loc4': { 'l': new firebase.firestore.GeoPoint(87.6, -130), 'g': 'cped3g0fur', 'd': { coordinates: new firebase.firestore.GeoPoint(87.6, -130) } },
          'loc6': { 'l': new firebase.firestore.GeoPoint(-72.258, 0.953215), 'g': 'h50svty4es', 'd': { coordinates: new firebase.firestore.GeoPoint(-72.258, 0.953215) } },
        });

        cl.x('p11');
      }).catch(failTestOnCaughtError);
    });

    it('set() does not throw errors given valid keys', () => {
      validKeys.forEach((validKey) => {
        expect(() => {
          geoFirestore.set(validKey, { coordinates: new firebase.firestore.GeoPoint(0, 0) });
        }).not.to.throw();
      });
    });

    it('set() throws errors given invalid keys', () => {
      invalidKeys.forEach((invalidKey) => {
        expect(() => {
          geoFirestore.set(invalidKey, { coordinates: new firebase.firestore.GeoPoint(0, 0) });
        }).to.throw();
      });
    });

    it('set() does not throw errors given valid locations', () => {
      validLocations.forEach((validLocation) => {
        expect(() => {
          geoFirestore.set('loc', { coordinates: validLocation });
        }).not.to.throw();
      });
    });

    it('set() throws errors given invalid locations', () => {
      invalidLocations.forEach((invalidLocation) => {
        // Setting location to null is valid since it will remove the key
        if (invalidLocation !== null) {
          expect(() => {
            geoFirestore.set('loc', { coordinates: invalidLocation });
          }).to.throw(Error, /Invalid GeoFirestore document/);
        }
      });
    });
  });

  describe('Adding multiple documents via set():', () => {
    it('set() returns a promise', (done) => {

      const cl = new Checklist(['p1'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) }
      }).then(() => {
        cl.x('p1');
      });
    });

    it('set() updates Firebase when adding new locations', (done) => {
      const cl = new Checklist(['p1', 'p2'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(50, 50) },
        'loc3': { coordinates: new firebase.firestore.GeoPoint(-90, -90) }
      }).then(() => {
        cl.x('p1');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(50, 50), 'g': 'v0gs3y0zh7', 'd': { coordinates: new firebase.firestore.GeoPoint(50, 50) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { coordinates: new firebase.firestore.GeoPoint(-90, -90) } }
        });

        cl.x('p2');
      }).catch(failTestOnCaughtError);
    });

    it('set() handles decimal latitudes and longitudes', (done) => {
      const cl = new Checklist(['p1', 'p2'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0.254, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(50, 50.293403) },
        'loc3': { coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938) }
      }).then(() => {
        cl.x('p1');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0.254, 0), 'g': 'ebpcrypzxv', 'd': { coordinates: new firebase.firestore.GeoPoint(0.254, 0) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(50, 50.293403), 'g': 'v0gu2qnx15', 'd': { coordinates: new firebase.firestore.GeoPoint(50, 50.293403) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(-82.614, -90.938), 'g': '1cr648sfx4', 'd': { coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938) } }
        });

        cl.x('p2');
      }).catch(failTestOnCaughtError);
    });

    it('set() updates Firebase when changing a pre-existing key', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(50, 50) },
        'loc3': { coordinates: new firebase.firestore.GeoPoint(-90, -90) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.set({
          'loc1': { coordinates: new firebase.firestore.GeoPoint(2, 3) }
        });
      }).then(() => {
        cl.x('p2');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(2, 3), 'g': 's065kk0dc5', 'd': { coordinates: new firebase.firestore.GeoPoint(2, 3) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(50, 50), 'g': 'v0gs3y0zh7', 'd': { coordinates: new firebase.firestore.GeoPoint(50, 50) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { coordinates: new firebase.firestore.GeoPoint(-90, -90) } }
        });

        cl.x('p3');
      }).catch(failTestOnCaughtError);
    });

    it('set() updates Firebase when changing a pre-existing key to the same location', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(50, 50) },
        'loc3': { coordinates: new firebase.firestore.GeoPoint(-90, -90) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.set({
          'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) }
        });
      }).then(() => {
        cl.x('p2');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(50, 50), 'g': 'v0gs3y0zh7', 'd': { coordinates: new firebase.firestore.GeoPoint(50, 50) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { coordinates: new firebase.firestore.GeoPoint(-90, -90) } }
        });

        cl.x('p3');
      }).catch(failTestOnCaughtError);
    });

    it('set() handles multiple keys at the same location', (done) => {
      const cl = new Checklist(['p1', 'p2'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc3': { coordinates: new firebase.firestore.GeoPoint(0, 0) }
      }).then(() => {
        cl.x('p1');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } }
        });

        cl.x('p2');
      }).catch(failTestOnCaughtError);
    });

    it('set() updates Firebase after complex operations', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5', 'p6'], expect, done);

      geoFirestore.set({
        'loc:1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(50, 50) },
        'loc%!A72f()3': { coordinates: new firebase.firestore.GeoPoint(-90, -90) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.remove('loc2');
      }).then(() => {
        cl.x('p2');

        return geoFirestore.set({
          'loc2': { coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621) },
          'loc4': { coordinates: new firebase.firestore.GeoPoint(87.6, -130) },
          'loc5': { coordinates: new firebase.firestore.GeoPoint(5, 55.555) }
        });
      }).then(() => {
        cl.x('p3');

        return geoFirestore.set({
          'loc5': null
        });
      }).then(() => {
        cl.x('p4');

        return geoFirestore.set({
          'loc:1': { coordinates: new firebase.firestore.GeoPoint(87.6, -130) },
          'loc6': { coordinates: new firebase.firestore.GeoPoint(-72.258, 0.953215) }
        });
      }).then(() => {
        cl.x('p5');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc:1': { 'l': new firebase.firestore.GeoPoint(87.6, -130), 'g': 'cped3g0fur', 'd': { coordinates: new firebase.firestore.GeoPoint(87.6, -130) } },
          'loc2': { 'l': new firebase.firestore.GeoPoint(0.2358, -72.621), 'g': 'd2h376zj8h', 'd': { coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621) } },
          'loc%!A72f()3': { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { coordinates: new firebase.firestore.GeoPoint(-90, -90) } },
          'loc4': { 'l': new firebase.firestore.GeoPoint(87.6, -130), 'g': 'cped3g0fur', 'd': { coordinates: new firebase.firestore.GeoPoint(87.6, -130) } },
          'loc6': { 'l': new firebase.firestore.GeoPoint(-72.258, 0.953215), 'g': 'h50svty4es', 'd': { coordinates: new firebase.firestore.GeoPoint(-72.258, 0.953215) } }
        });

        cl.x('p6');
      }).catch(failTestOnCaughtError);
    });

    it('set() does not throw errors given valid keys', () => {
      validKeys.forEach((validKey) => {
        expect(() => {
          const locations = {};
          locations[validKey] = { coordinates: new firebase.firestore.GeoPoint(0, 0) };
          geoFirestore.set(locations);
        }).not.to.throw();
      });
    });

    it('set() throws errors given invalid keys', () => {
      invalidKeys.forEach((invalidKey) => {
        if (invalidKey !== null && invalidKey !== undefined && typeof invalidKey !== 'boolean') {
          expect(() => {
            const locations = {};
            // @ts-ignore
            locations[invalidKey] = { coordinates: new firebase.firestore.GeoPoint(0, 0) };
            geoFirestore.set(locations);
          }).to.throw();
        }
      });
    });

    it('set() throws errors given a location argument in combination with an object', () => {
      expect(() => {
        geoFirestore.set({
          'loc': { coordinates: new firebase.firestore.GeoPoint(0, 0) }
        }, { coordinates: new firebase.firestore.GeoPoint(0, 0) });
      }).to.throw();
    });

    it('set() does not throw errors given valid locations', () => {
      validLocations.forEach((validLocation) => {
        expect(() => {
          geoFirestore.set({
            'loc': { coordinates: validLocation }
          });
        }).not.to.throw();
      });
    });

    it('set() throws errors given invalid locations', () => {
      invalidLocations.forEach((invalidLocation) => {
        // Setting location to null is valid since it will remove the key
        if (invalidLocation !== null) {
          expect(() => {
            geoFirestore.set({
              'loc': { coordinates: invalidLocation }
            });
          }).to.throw(Error, /Invalid GeoFirestore document/);
        }
      });
    });
  });

  describe('Updating single documents via update():', () => {

    it('update() returns a promise', (done) => {
        const cl = new Checklist(['p0', 'p1'], expect, done);

        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(0, 0)
            }
        }).then(() => {
            cl.x('p0');
        }).then(() => {
            cl.x('p1');
            return geoFirestore.update('loc1', {
                coordinates: new firebase.firestore.GeoPoint(1, 1)
            });
        });
    });

    it('update() updates Firebase documents', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2', 'p3', 'p4'], expect, done);

        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            }
        }).then(() => {
            cl.x('p0');
            return geoFirestore.update('loc1', {
                coordinates: new firebase.firestore.GeoPoint(0, 0)
            });
        }).then(() => {
            cl.x('p1');
            return geoFirestore.update('loc2', {
                coordinates: new firebase.firestore.GeoPoint(50, 50)
            });
        }).then(() => {
            cl.x('p2');
            return geoFirestore.update('loc3', {
                coordinates: new firebase.firestore.GeoPoint(-90, -90)
            });
        }).then(() => {
            cl.x('p3');
            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p4');
            firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);

            expect(firebaseData).to.have.deep.members([{
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(0, 0)
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(50, 50),
                    'g': 'v0gs3y0zh7',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(50, 50)
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(-90, -90),
                    'g': '1bpbpbpbpb',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(-90, -90)
                    }
                },
            ]);
        }).catch((error) => {
            failTestOnCaughtError(error);
        });
    });

    it('update() handles custom fields for coordinates', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2', 'p3', 'p4', 'p5'], expect, done);
        geoFirestore.set('loc1', {
            location: new firebase.firestore.GeoPoint(42, -42)
        }, 'location').then(() => {
            cl.x('p0');
            return geoFirestore.set('loc2', {
                place: new firebase.firestore.GeoPoint(42, -42)
            }, 'place');
        }).then(() => {
            cl.x('p1');
            return geoFirestore.set('loc3', {
                coord: new firebase.firestore.GeoPoint(42, -42)
            }, 'coord');
        }).then(() => {
            cl.x('p2');
            return geoFirestore.update('loc1', {
                location: new firebase.firestore.GeoPoint(0, 0)
            }, 'location');
        }).then(() => {
            cl.x('p3');
            return geoFirestore.update('loc2', {
                place: new firebase.firestore.GeoPoint(50, 50)
            }, 'place');
        }).then(() => {
            cl.x('p4');
            return geoFirestore.update('loc3', {
                coord: new firebase.firestore.GeoPoint(-90, -90)
            }, 'coord');
        }).then(() => {
            cl.x('p5');
            return getFirestoreData();
        }).then((firebaseData) => {
            firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);
            expect(firebaseData).to.have.deep.members([{
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        location: new firebase.firestore.GeoPoint(0, 0)
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(50, 50),
                    'g': 'v0gs3y0zh7',
                    'd': {
                        place: new firebase.firestore.GeoPoint(50, 50)
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(-90, -90),
                    'g': '1bpbpbpbpb',
                    'd': {
                        coord: new firebase.firestore.GeoPoint(-90, -90)
                    }
                }
            ]);
        }).catch(failTestOnCaughtError);
    });

    it('update() updates Firebase document attributes without GeoPoints', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2', 'p3', 'p4'], expect, done);

        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(0, 0),
                bool: false,
                string: 'string'
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(50, 50),
                bool: false,
                string: 'string'
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-90, -90),
                bool: false,
                string: 'string'
            }
        }).then(() => {
            cl.x('p0');
            return geoFirestore.update('loc1', {
                bool: true,
                string: 'varchar'
            });
        }).then(() => {
            cl.x('p1');
            return geoFirestore.update('loc2', {
                bool: true,
                string: 'varchar',
                array: [0, 1, 3]
            });
        }).then(() => {
            cl.x('p2');
            return geoFirestore.update('loc3', {
                bool: true,
                string: 'varchar',
                array: [0, 1, 3],
                object: {
                    foo: 'bar'
                }
            });
        }).then(() => {
            cl.x('p3');
            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p4');

            firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);

            expect(firebaseData).to.have.deep.members([{
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(0, 0),
                        bool: true,
                        string: 'varchar'
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(50, 50),
                    'g': 'v0gs3y0zh7',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(50, 50),
                        bool: true,
                        string: 'varchar',
                        array: [0, 1, 3]
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(-90, -90),
                    'g': '1bpbpbpbpb',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(-90, -90),
                        bool: true,
                        string: 'varchar',
                        array: [0, 1, 3],
                        object: {
                            foo: 'bar'
                        }
                    }
                },
            ]);
        }).catch((error) => {
            failTestOnCaughtError(error);
        });
    });

    it('update() handles decimal latitudes and longitudes', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2', 'p3', 'p4'], expect, done);
        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            }
        }).then(() => {
            cl.x('p0');

            return geoFirestore.update('loc1', {
                coordinates: new firebase.firestore.GeoPoint(0.254, 0)
            });
        }).then(() => {
            cl.x('p1');

            return geoFirestore.update('loc2', {
                coordinates: new firebase.firestore.GeoPoint(50, 50.293403)
            });
        }).then(() => {
            cl.x('p2');

            return geoFirestore.update('loc3', {
                coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938)
            });
        }).then(() => {
            cl.x('p3');

            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p4');

            expect(firebaseData).to.deep.equal({
                'loc1': {
                    'l': new firebase.firestore.GeoPoint(0.254, 0),
                    'g': 'ebpcrypzxv',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(0.254, 0)
                    }
                },
                'loc2': {
                    'l': new firebase.firestore.GeoPoint(50, 50.293403),
                    'g': 'v0gu2qnx15',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(50, 50.293403)
                    }
                },
                'loc3': {
                    'l': new firebase.firestore.GeoPoint(-82.614, -90.938),
                    'g': '1cr648sfx4',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938)
                    }
                },
            });
        }).catch(failTestOnCaughtError);
    });

    it('update() updates Firebase after complex operations', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'], expect, done);

        geoFirestore.set({
            'loc:1': {
                coordinates: new firebase.firestore.GeoPoint(42, -42)
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(42, -42)
            },
            'loc%!A72f()3': {
                coordinates: new firebase.firestore.GeoPoint(42, -42)
            },
            'loc4': {
                coordinates: new firebase.firestore.GeoPoint(42, -42)
            },
            'loc6': {
                coordinates: new firebase.firestore.GeoPoint(42, 42)
            }
        }).then(() => {
            cl.x('p0');

            return geoFirestore.update('loc:1', {
                coordinates: new firebase.firestore.GeoPoint(0, 0)
            });
        }).then(() => {
            cl.x('p1');

            return geoFirestore.update('loc2', {
                coordinates: new firebase.firestore.GeoPoint(50, 50)
            });
        }).then(() => {
            cl.x('p2');

            return geoFirestore.update('loc%!A72f()3', {
                coordinates: new firebase.firestore.GeoPoint(-90, -90)
            });
        }).then(() => {
            cl.x('p3');

            return geoFirestore.update('loc2', {
                coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621)
            });
        }).then(() => {
            cl.x('p4');

            return geoFirestore.update('loc4', {
                coordinates: new firebase.firestore.GeoPoint(87.6, -130)
            });
        }).then(() => {
            cl.x('p5');

            return geoFirestore.update('loc:1', {
                coordinates: new firebase.firestore.GeoPoint(87.6, -130)
            });
        }).then(() => {
            cl.x('p6');

            return geoFirestore.update('loc6', {
                coordinates: new firebase.firestore.GeoPoint(-72.258, 0.953215)
            });
        }).then(() => {
            cl.x('p7');

            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p8');
            expect(firebaseData).to.deep.equal({
                'loc:1': {
                    'l': new firebase.firestore.GeoPoint(87.6, -130),
                    'g': 'cped3g0fur',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(87.6, -130)
                    }
                },
                'loc2': {
                    'l': new firebase.firestore.GeoPoint(0.2358, -72.621),
                    'g': 'd2h376zj8h',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621)
                    }
                },
                'loc%!A72f()3': {
                    'l': new firebase.firestore.GeoPoint(-90, -90),
                    'g': '1bpbpbpbpb',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(-90, -90)
                    }
                },
                'loc4': {
                    'l': new firebase.firestore.GeoPoint(87.6, -130),
                    'g': 'cped3g0fur',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(87.6, -130)
                    }
                },
                'loc6': {
                    'l': new firebase.firestore.GeoPoint(-72.258, 0.953215),
                    'g': 'h50svty4es',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(-72.258, 0.953215)
                    }
                },
            });

        }).catch(failTestOnCaughtError);
    });


    it('update() does not throw errors given valid keys', (done) => {

        const clMap = validKeys.map((value, key) => (`p${key}`));
        const clTracker = clMap.slice();
        const cl = new Checklist(clTracker, expect, done);

        validKeys.forEach((validKey, indexKey) => {
            geoFirestore.set(validKey, {
                    coordinates: new firebase.firestore.GeoPoint(0, 0)
                })
                .then(() => {
                    expect(() => {
                        geoFirestore.update(validKey, {
                                coordinates: new firebase.firestore.GeoPoint(0, 0)
                            })
                            .then(() => {
                                cl.x(clMap[indexKey]);
                            });
                    }).not.to.throw();
                });
        });
    });

    it('update() throws errors given invalid keys', () => {
        invalidKeys.forEach((invalidKey, indexKey) => {
            expect(() => {
                geoFirestore.update(invalidKey, {
                    coordinates: new firebase.firestore.GeoPoint(0, 0)
                });
            }).to.throw();
        });
    });


    it('update() does not throw errors given valid locations', (done) => {
        const clMap = validLocations.map((value, key) => (`p${key}`));
        const clTracker = clMap.slice();
        const cl = new Checklist(clTracker, expect, done);

        validLocations.forEach((validLocation, indexKey) => {
            geoFirestore.set('loc', {
                    coordinates: validLocation
                })
                .then(() => {
                    expect(() => {
                        geoFirestore.update('loc', {
                                coordinates: validLocation
                            })
                            .then(() => {
                                cl.x(clMap[indexKey]);
                            });
                    }).not.to.throw();
                });
        });
    });

    it('update() throws errors given invalid locations', () => {

        invalidLocations.forEach((invalidLocation, indexKey) => {
            expect(() => {
                geoFirestore.update('loc', {
                    coordinates: invalidLocation
                });
            }).to.throw(Error, /Invalid GeoFirestore document/);
        });
    });

    it('update() updates/adds additional fields in documents', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2', 'p3', 'p4'], expect, done);

        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42),
                bool: false,
                string: 'string'
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42),
                bool: false,
                string: 'string'
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42),
                bool: false,
                string: 'string'
            }
        }).then(() => {
            cl.x('p0');
            return geoFirestore.update('loc1', {
                coordinates: new firebase.firestore.GeoPoint(0, 0),
                bool: true,
                string: 'varchar'
            });
        }).then(() => {
            cl.x('p1');
            return geoFirestore.update('loc2', {
                coordinates: new firebase.firestore.GeoPoint(50, 50),
                bool: true,
                string: 'varchar',
                array: [0, 1, 3]
            });
        }).then(() => {
            cl.x('p2');
            return geoFirestore.update('loc3', {
                coordinates: new firebase.firestore.GeoPoint(-90, -90),
                bool: true,
                string: 'varchar',
                array: [0, 1, 3],
                object: {
                    foo: 'bar'
                }
            });
        }).then(() => {
            cl.x('p3');
            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p4');
            firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);

            expect(firebaseData).to.have.deep.members([{
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(0, 0),
                        bool: true,
                        string: 'varchar'
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(50, 50),
                    'g': 'v0gs3y0zh7',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(50, 50),
                        bool: true,
                        string: 'varchar',
                        array: [0, 1, 3]
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(-90, -90),
                    'g': '1bpbpbpbpb',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(-90, -90),
                        bool: true,
                        string: 'varchar',
                        array: [0, 1, 3],
                        object: {
                            foo: 'bar'
                        }
                    }
                },
            ]);
        }).catch((error) => {
            failTestOnCaughtError(error);
        });
    });

    it('update() does not delete existing document fields ', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2'], expect, done);
        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(42, 42),
                bool: true,
                string: 'varchar',
                array: [0, 1, 3],
                object: {
                    foo: 'bar'
                }
            },
        }).then(() => {
            cl.x('p0');
            return geoFirestore.update('loc1', {
                coordinates: new firebase.firestore.GeoPoint(50, 50)
            });
        }).then(() => {
            cl.x('p1');
            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p2');
            firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);

            expect(firebaseData).to.have.deep.members([{
                'l': new firebase.firestore.GeoPoint(50, 50),
                'g': 'v0gs3y0zh7',
                'd': {
                    'coordinates': new firebase.firestore.GeoPoint(50, 50),
                    bool: true,
                    string: 'varchar',
                    array: [0, 1, 3],
                    object: {
                        foo: 'bar'
                    }
                }
            }, ]);
        }).catch((error) => {
            failTestOnCaughtError(error);
        });
    });

    it('update() updates Firebase when changing a pre-existing key to the same location', (done) => {
        const cl = new Checklist(['p1', 'p2', 'p3'], expect, done);

        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(0, 0)
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(50, 50)
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-90, -90)
            }
        }).then(() => {
            cl.x('p1');

            return geoFirestore.update({
                'loc1': {
                    coordinates: new firebase.firestore.GeoPoint(0, 0)
                }
            });
        }).then(() => {
            cl.x('p2');

            return getFirestoreData();
        }).then((firebaseData) => {
            expect(firebaseData).to.deep.equal({
                'loc1': {
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(0, 0)
                    }
                },
                'loc2': {
                    'l': new firebase.firestore.GeoPoint(50, 50),
                    'g': 'v0gs3y0zh7',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(50, 50)
                    }
                },
                'loc3': {
                    'l': new firebase.firestore.GeoPoint(-90, -90),
                    'g': '1bpbpbpbpb',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(-90, -90)
                    }
                }
            });

            cl.x('p3');
        }).catch(failTestOnCaughtError);
    });
});


describe('Updating multiple documents via update():', () => {

    it('update() multiple documents returns a promise', (done) => {
        const cl = new Checklist(['p0', 'p1'], expect, done);

        geoFirestore.set({
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc4': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc5': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            }
        }).then(() => {
            cl.x('p0');
        }).then(() => {
            cl.x('p1');
            return geoFirestore.update({
                'loc2': {
                    coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621)
                },
                'loc4': {
                    coordinates: new firebase.firestore.GeoPoint(87.6, -130)
                },
                'loc5': {
                    coordinates: new firebase.firestore.GeoPoint(5, 55.555)
                }
            });
        });
    });

    it('update() updates multiple Firebase documents', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2'], expect, done);

        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            }
        }).then(() => {
            cl.x('p0');
            return geoFirestore.update({
                'loc1': {
                    coordinates: new firebase.firestore.GeoPoint(0, 0)
                },
                'loc2': {
                    coordinates: new firebase.firestore.GeoPoint(50, 50)
                },
                'loc3': {
                    coordinates: new firebase.firestore.GeoPoint(-90, -90)
                }
            });
        }).then(() => {
            cl.x('p1');
            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p2');
            firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);
            expect(firebaseData).to.have.deep.members([{
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(0, 0)
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(50, 50),
                    'g': 'v0gs3y0zh7',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(50, 50)
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(-90, -90),
                    'g': '1bpbpbpbpb',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(-90, -90)
                    }
                },
            ]);
        }).catch((error) => {
            failTestOnCaughtError(error);
        });
    });

    it('update() handles multiple decimal latitudes and longitudes', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2'], expect, done);
        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            }
        }).then(() => {
            cl.x('p0');

            return geoFirestore.update({
                'loc1': {
                    coordinates: new firebase.firestore.GeoPoint(0.254, 0)
                },
                'loc2': {
                    coordinates: new firebase.firestore.GeoPoint(50, 50.293403)
                },
                'loc3': {
                    coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938)
                },
            });
        }).then(() => {
            cl.x('p1');

            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p2');

            expect(firebaseData).to.deep.equal({
                'loc1': {
                    'l': new firebase.firestore.GeoPoint(0.254, 0),
                    'g': 'ebpcrypzxv',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(0.254, 0)
                    }
                },
                'loc2': {
                    'l': new firebase.firestore.GeoPoint(50, 50.293403),
                    'g': 'v0gu2qnx15',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(50, 50.293403)
                    }
                },
                'loc3': {
                    'l': new firebase.firestore.GeoPoint(-82.614, -90.938),
                    'g': '1cr648sfx4',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(-82.614, -90.938)
                    }
                },
            });
        }).catch(failTestOnCaughtError);
    });

    it('update() updates/adds multiple document fields', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2'], expect, done);

        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42),
                bool: false,
                string: 'string'
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42),
                bool: false,
                string: 'string'
            }
        }).then(() => {

            cl.x('p0');
            return geoFirestore.update({
                'loc1': {
                    coordinates: new firebase.firestore.GeoPoint(0, 0),
                    bool: true,
                    string: 'varchar'
                },
                'loc2': {
                    coordinates: new firebase.firestore.GeoPoint(50, 50),
                    bool: true,
                    string: 'varchar',
                    array: [0, 1, 3]
                },
                'loc3': {
                    coordinates: new firebase.firestore.GeoPoint(-90, -90),
                    bool: true,
                    string: 'varchar',
                    array: [0, 1, 3],
                    object: {
                        foo: 'bar'
                    }
                },
            });

        }).then(() => {
            cl.x('p1');
            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p2');
            firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);
            expect(firebaseData).to.have.deep.members([{
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(0, 0),
                        bool: true,
                        string: 'varchar'
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(50, 50),
                    'g': 'v0gs3y0zh7',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(50, 50),
                        bool: true,
                        string: 'varchar',
                        array: [0, 1, 3]
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(-90, -90),
                    'g': '1bpbpbpbpb',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(-90, -90),
                        bool: true,
                        string: 'varchar',
                        array: [0, 1, 3],
                        object: {
                            foo: 'bar'
                        }
                    }
                },
            ]);
        }).catch((error) => {
            failTestOnCaughtError(error);
        });
    });

    it('update() updates/adds multiple document fields without GeoPoints', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2'], expect, done);

        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(0, 0),
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(50, 50),
                bool: false,
                string: 'string'
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-90, -90),
                bool: false,
                string: 'string'
            }
        }).then(() => {
            cl.x('p0');
            return geoFirestore.update({
                'loc1': {
                    bool: true,
                    string: 'varchar'
                },
                'loc2': {
                    bool: true,
                    string: 'varchar',
                    array: [0, 1, 3]
                },
                'loc3': {
                    bool: true,
                    string: 'varchar',
                    array: [0, 1, 3],
                    object: {
                        foo: 'bar'
                    }
                },
            });

        }).then(() => {
            cl.x('p1');
            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p2');
            firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);
            expect(firebaseData).to.have.deep.members([{
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(0, 0),
                        bool: true,
                        string: 'varchar'
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(50, 50),
                    'g': 'v0gs3y0zh7',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(50, 50),
                        bool: true,
                        string: 'varchar',
                        array: [0, 1, 3]
                    }
                },
                {
                    'l': new firebase.firestore.GeoPoint(-90, -90),
                    'g': '1bpbpbpbpb',
                    'd': {
                        'coordinates': new firebase.firestore.GeoPoint(-90, -90),
                        bool: true,
                        string: 'varchar',
                        array: [0, 1, 3],
                        object: {
                            foo: 'bar'
                        }
                    }
                },
            ]);
        }).catch((error) => {
            failTestOnCaughtError(error);
        });
    });

    it('update() handles multiple keys at the same location', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2'], expect, done);

        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc2': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            },
            'loc3': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42)
            }
        }).then(() => {
            cl.x('p0');
            return geoFirestore.set({
                'loc1': {
                    coordinates: new firebase.firestore.GeoPoint(0, 0)
                },
                'loc2': {
                    coordinates: new firebase.firestore.GeoPoint(0, 0)
                },
                'loc3': {
                    coordinates: new firebase.firestore.GeoPoint(0, 0)
                }
            });
        }).then(() => {
            cl.x('p1');

            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p2');
            expect(firebaseData).to.deep.equal({
                'loc1': {
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(0, 0)
                    }
                },
                'loc2': {
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(0, 0)
                    }
                },
                'loc3': {
                    'l': new firebase.firestore.GeoPoint(0, 0),
                    'g': '7zzzzzzzzz',
                    'd': {
                        coordinates: new firebase.firestore.GeoPoint(0, 0)
                    }
                }
            });

        }).catch(failTestOnCaughtError);
    });


    it('update() does not delete existing document fields ', (done) => {
        const cl = new Checklist(['p0', 'p1', 'p2'], expect, done);
        geoFirestore.set({
            'loc1': {
                coordinates: new firebase.firestore.GeoPoint(-42, 42),
                bool: true,
                string: 'varchar',
                array: [0, 1, 3],
                object: {
                    foo: 'bar'
                }
            },
        }).then(() => {
            cl.x('p0');
            return geoFirestore.update('loc1', {
                coordinates: new firebase.firestore.GeoPoint(50, 50)
            });
        }).then(() => {
            cl.x('p1');
            return getFirestoreData();
        }).then((firebaseData) => {
            cl.x('p2');
            firebaseData = Object.keys(firebaseData).map(key => firebaseData[key]);

            expect(firebaseData).to.have.deep.members([{
                'l': new firebase.firestore.GeoPoint(50, 50),
                'g': 'v0gs3y0zh7',
                'd': {
                    'coordinates': new firebase.firestore.GeoPoint(50, 50),
                    bool: true,
                    string: 'varchar',
                    array: [0, 1, 3],
                    object: {
                        foo: 'bar'
                    }
                }
            }, ]);
        }).catch((error) => {
            failTestOnCaughtError(error);
        });
    });
});

  describe('Retrieving a single document via get():', () => {
    it('get() returns a promise', (done) => {
      const cl = new Checklist(['p1'], expect, done);

      geoFirestore.get('loc1').then((ref) => {
        cl.x('p1');
      });
    });

    it('get() returns null for non-existent keys', (done) => {
      const cl = new Checklist(['p1'], expect, done);

      geoFirestore.get('loc1').then((location) => {
        expect(location).to.equal(null);

        cl.x('p1');
      });
    });

    it('get() retrieves locations given existing keys', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(50, 50) },
        'loc3': { coordinates: new firebase.firestore.GeoPoint(-90, -90) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.get('loc1');
      }).then((location) => {
        expect(location).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });
        cl.x('p2');

        return geoFirestore.get('loc2');
      }).then((location) => {
        expect(location).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(50, 50) });
        cl.x('p3');

        return geoFirestore.get('loc3');
      }).then((location) => {
        expect(location).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(-90, -90) });
        cl.x('p4');
      }).catch(failTestOnCaughtError);
    });

    it('get() does not throw errors given valid keys', () => {
      validKeys.forEach((validKey) => {
        expect(() => geoFirestore.get(validKey)).not.to.throw();
      });
    });

    it('get() throws errors given invalid keys', () => {
      invalidKeys.forEach((invalidKey) => {
        // @ts-ignore
        expect(() => geoFirestore.get(invalidKey)).to.throw();
      });
    });
  });

  describe('Removing a single document via remove():', () => {
    it('remove() returns a promise', (done) => {
      const cl = new Checklist(['p1', 'p2'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.remove('loc1');
      }).then(() => {
        cl.x('p2');
      });
    });

    it('set() removes existing location given null', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(2, 3) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.get('loc1');
      }).then((location) => {
        expect(location).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });

        cl.x('p2');

        return geoFirestore.set('loc1', null);
      }).then(() => {
        cl.x('p3');

        return geoFirestore.get('loc1');
      }).then((location) => {
        expect(location).to.equal(null);

        cl.x('p4');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc2': { 'l': new firebase.firestore.GeoPoint(2, 3), 'g': 's065kk0dc5', 'd': { coordinates: new firebase.firestore.GeoPoint(2, 3) } }
        });

        cl.x('p5');
      }).catch(failTestOnCaughtError);
    });

    it('set() does nothing given a non-existent location and null', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5'], expect, done);

      geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.get('loc1');
      }).then((location) => {
        expect(location).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });

        cl.x('p2');

        return geoFirestore.set('loc2', null);
      }).then(() => {
        cl.x('p3');

        return geoFirestore.get('loc2');
      }).then((location) => {
        expect(location).to.equal(null);

        cl.x('p4');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } }
        });

        cl.x('p5');
      }).catch(failTestOnCaughtError);
    });

    it('set() removes existing location given null', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(2, 3) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.get('loc1');
      }).then((location) => {
        expect(location).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });

        cl.x('p2');

        return geoFirestore.set({
          'loc1': null,
          'loc3': { coordinates: new firebase.firestore.GeoPoint(-90, -90) }
        });
      }).then(() => {
        cl.x('p3');

        return geoFirestore.get('loc1');
      }).then((location) => {
        expect(location).to.equal(null);

        cl.x('p4');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc2': { 'l': new firebase.firestore.GeoPoint(2, 3), 'g': 's065kk0dc5', 'd': { coordinates: new firebase.firestore.GeoPoint(2, 3) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(-90, -90), 'g': '1bpbpbpbpb', 'd': { coordinates: new firebase.firestore.GeoPoint(-90, -90) } }
        });

        cl.x('p5');
      }).catch(failTestOnCaughtError);
    });

    it('set() does nothing given a non-existent location and null', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': null
      }).then(() => {
        cl.x('p1');

        return geoFirestore.get('loc1');
      }).then((location) => {
        expect(location).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });

        cl.x('p2');

        return geoFirestore.get('loc2');
      }).then((location) => {
        expect(location).to.equal(null);

        cl.x('p3');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } }
        });

        cl.x('p4');
      }).catch(failTestOnCaughtError);
    });

    it('remove() removes existing location', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5'], expect, done);

      geoFirestore.set({
        'loc:^%*1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(2, 3) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.get('loc:^%*1');
      }).then((location) => {
        expect(location).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });

        cl.x('p2');

        return geoFirestore.remove('loc:^%*1');
      }).then(() => {
        cl.x('p3');

        return geoFirestore.get('loc:^%*1');
      }).then((location) => {
        expect(location).to.equal(null);

        cl.x('p4');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc2': { 'l': new firebase.firestore.GeoPoint(2, 3), 'g': 's065kk0dc5', 'd': { coordinates: new firebase.firestore.GeoPoint(2, 3) } }
        });

        cl.x('p5');
      }).catch(failTestOnCaughtError);
    });

    it('remove() does nothing given a non-existent location', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5'], expect, done);

      geoFirestore.set('loc1', { coordinates: new firebase.firestore.GeoPoint(0, 0) }).then(() => {
        cl.x('p1');

        return geoFirestore.get('loc1');
      }).then((location) => {
        expect(location).to.deep.equal({ coordinates: new firebase.firestore.GeoPoint(0, 0) });

        cl.x('p2');

        return geoFirestore.remove('loc2');
      }).then(() => {
        cl.x('p3');

        return geoFirestore.get('loc2');
      }).then((location) => {
        expect(location).to.equal(null);

        cl.x('p4');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc1': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } }
        });

        cl.x('p5');
      }).catch(failTestOnCaughtError);
    });

    it('remove() only removes one key if multiple keys are at the same location', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(2, 3) },
        'loc3': { coordinates: new firebase.firestore.GeoPoint(0, 0) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.remove('loc1');
      }).then(() => {
        cl.x('p2');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc2': { 'l': new firebase.firestore.GeoPoint(2, 3), 'g': 's065kk0dc5', 'd': { coordinates: new firebase.firestore.GeoPoint(2, 3) } },
          'loc3': { 'l': new firebase.firestore.GeoPoint(0, 0), 'g': '7zzzzzzzzz', 'd': { coordinates: new firebase.firestore.GeoPoint(0, 0) } }
        });

        cl.x('p3');
      }).catch(failTestOnCaughtError);
    });

    it('remove() does not throw errors given valid keys', () => {
      validKeys.forEach((validKey) => {
        expect(() => geoFirestore.remove(validKey)).not.to.throw();
      });
    });

    it('remove() throws errors given invalid keys', () => {
      invalidKeys.forEach((invalidKey) => {
        // @ts-ignore
        expect(() => geoFirestore.remove(invalidKey)).to.throw();
      });
    });
  });

  describe('Removing multiple documents via remove():', () => {
    it('remove() returns a promise', (done) => {
      const cl = new Checklist(['p1', 'p2'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.remove('loc1');
      }).then(() => {
        cl.x('p2');
      });
    });

    it('remove() updates Firebase when removing documents', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3'], expect, done);

      geoFirestore.set({
        'loc1': { coordinates: new firebase.firestore.GeoPoint(0, 0) },
        'loc2': { coordinates: new firebase.firestore.GeoPoint(50, 50) },
        'loc3': { coordinates: new firebase.firestore.GeoPoint(-90, -90) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.remove(['loc1', 'loc2', 'loc3']);
      }).then(() => {
        cl.x('p2');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({});

        cl.x('p3');
      }).catch(failTestOnCaughtError);
    });

    it('remove() updates Firebase after complex operations', (done) => {
      const cl = new Checklist(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'], expect, done);

      geoFirestore.set({
        'loc2': { coordinates: new firebase.firestore.GeoPoint(50, 50) }
      }).then(() => {
        cl.x('p1');

        return geoFirestore.remove('loc2');
      }).then(() => {
        cl.x('p2');

        return geoFirestore.set({
          'loc3': { coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621) },
          'loc4': { coordinates: new firebase.firestore.GeoPoint(87.6, -130) },
          'loc5': { coordinates: new firebase.firestore.GeoPoint(5, 55.555) }
        });
      }).then(() => {
        cl.x('p3');

        return geoFirestore.remove('loc5');
      }).then(() => {
        cl.x('p4');

        return geoFirestore.set({
          'loc1': { coordinates: new firebase.firestore.GeoPoint(87.6, -130) },
          'loc2': { coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621) },
          'loc6': { coordinates: new firebase.firestore.GeoPoint(-72.258, 0.953215) }
        });
      }).then(() => {
        cl.x('p5');

        return geoFirestore.remove(['loc1', 'loc3', 'loc6']);
      }).then(() => {
        cl.x('p6');

        return getFirestoreData();
      }).then((firebaseData) => {
        expect(firebaseData).to.deep.equal({
          'loc2': { 'l': new firebase.firestore.GeoPoint(0.2358, -72.621), 'g': 'd2h376zj8h', 'd': { coordinates: new firebase.firestore.GeoPoint(0.2358, -72.621) } },
          'loc4': { 'l': new firebase.firestore.GeoPoint(87.6, -130), 'g': 'cped3g0fur', 'd': { coordinates: new firebase.firestore.GeoPoint(87.6, -130) } }
        });

        cl.x('p7');
      }).catch(failTestOnCaughtError);
    });
  });

  describe('query():', () => {
    it('query() returns GeoFireQuery instance', () => {
      geoFirestoreQueries.push(geoFirestore.query({ center: new firebase.firestore.GeoPoint(1, 2), radius: 1000 }));

      expect(geoFirestoreQueries[0] instanceof GeoFirestoreQuery).to.be.ok; // tslint:disable-line
    });

    it('query() does not throw errors given valid query criteria', () => {
      validQueryCriterias.forEach((validQueryCriteria) => {
        if (typeof validQueryCriteria.center !== 'undefined' && typeof validQueryCriteria.radius !== 'undefined') {
          expect(() => geoFirestore.query(validQueryCriteria)).not.to.throw();
        }
      });
    });

    it('query() throws errors given invalid query criteria', () => {
      invalidQueryCriterias.forEach((invalidQueryCriteria) => {
        // @ts-ignore
        expect(() => geoFirestore.query(invalidQueryCriteria)).to.throw();
      });
    });
  });
});

import * as chai from 'chai';
import * as firebase from 'firebase';

import { GeoFirestore } from '../src/geofirestore';
import { GeoFirestoreQuery } from '../src/query';
import {
  afterEachHelper, beforeEachHelper, Checklist, failTestOnCaughtError, geoFirestore, geoFirestoreRef, getFirestoreData, geoFirestoreQueries,
  invalidFirebaseRefs, invalidKeys, invalidLocations, invalidQueryCriterias, validKeys, validLocations, validQueryCriterias
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

  describe('Adding a single location via set():', () => {
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
        failTestOnCaughtError(error)
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

  describe('Adding multiple locations via set():', () => {
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

  describe('Retrieving locations:', () => {
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

  describe('Removing locations:', () => {
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

  describe('query():', () => {
    it('query() returns GeoFireQuery instance', () => {
      geoFirestoreQueries.push(geoFirestore.query({ center: new firebase.firestore.GeoPoint(1, 2), radius: 1000 }));

      expect(geoFirestoreQueries[0] instanceof GeoFirestoreQuery).to.be.ok;
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

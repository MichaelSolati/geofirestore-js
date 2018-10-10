#### 2.2.2 (2018-10-10)

##### Documentation Changes

*  update docs around query functions ([073991f4](https://github.com/MichaelSolati/geofirestore/commit/073991f4b5d4fe72e93a5125ab202c7ab2d4cfe5))

#### 2.2.1 (2018-09-25)

##### Chores

*  update dependencies ([504d7e09](https://github.com/MichaelSolati/geofirestore/commit/504d7e094d297741e1710153db80f3ce4ab689f4))

##### Refactors

* **GeoFirestoreQuery:**  move around event firing and fix typing ([ff5fa228](https://github.com/MichaelSolati/geofirestore/commit/ff5fa22873ea42f341b0b8cf33caa9cba144dc05))

### 2.2.0 (2018-09-17)

##### New Features

* **GeoFirestore:**  add ability to use  with persistence options, fixes [#31](https://github.com/MichaelSolati/geofirestore/pull/31) ([9e2a2e40](https://github.com/MichaelSolati/geofirestore/commit/9e2a2e403e9b22477fd879855352c6d4da7032bd))

#### 2.1.2 (2018-08-24)

##### Chores

* **node:**  add node typings ([344602f0](https://github.com/MichaelSolati/geofirestore/commit/344602f0012bf49e873a7bae673ae438076c1acb))

##### Bug Fixes

* **firebase-admin:**  fix docChanges prop/method issue while adding more extensive typing ([8c1d77f5](https://github.com/MichaelSolati/geofirestore/commit/8c1d77f5c6bf6c87bebf2330863c9fe7619f3e35))

#### 2.1.1 (2018-08-08)

##### Build System / Dependencies

*  add lint to travis ([8318f861](https://github.com/MichaelSolati/geofirestore/commit/8318f861ff349f669f44b846f65376c870330259))

##### Bug Fixes

*  resolve cloud typings, fixes [#22](https://github.com/MichaelSolati/geofirestore/pull/22) ([4496b16c](https://github.com/MichaelSolati/geofirestore/commit/4496b16cfe82bc9fd2bd08ba3d680af9376cdd12))

### 2.1.0 (2018-08-07)

##### Chores

*  update dependencies ([346cd080](https://github.com/MichaelSolati/geofirestore/commit/346cd08088b92268097fb8467e4c51835725b06b))
*  fix coveralls badge in README ([a1843f9e](https://github.com/MichaelSolati/geofirestore/commit/a1843f9ef151ae8672b8c34f8f22c5f80e7c215a))

##### Documentation Changes

* **GeoFirestoreQuery:**  add docs for `query` function of `GeoFirestoreQuery`'s `GeoFirestoreObj`, fixes [#8](https://github.com/MichaelSolati/geofirestore/pull/8) ([79976caf](https://github.com/MichaelSolati/geofirestore/commit/79976cafc45b40b826f929cc199f22efe571b86a))
*  add example application as well as site deployment ([1192262a](https://github.com/MichaelSolati/geofirestore/commit/1192262a99ce2a8b68a869ba0ef05e007dca6119))

##### New Features

*  add support for firebase-admin sdk, fixes [#9](https://github.com/MichaelSolati/geofirestore/pull/9) ([8a763041](https://github.com/MichaelSolati/geofirestore/commit/8a763041591aed6836459c853ab6b927cf83298d))
* **query:**  add ability to write custom query function for GeoFirestoreQuery ([05bccde5](https://github.com/MichaelSolati/geofirestore/commit/05bccde507f94a230c986cc8ea70240e8671e0fe))

##### Bug Fixes

* **test:**  fix a `remove` test for GeoFirestore ([521adabe](https://github.com/MichaelSolati/geofirestore/commit/521adabea0f4cb05ea821830655f05a4befc3463))
* **validateCriteria:**  check QueryCriteria's query to ensure it is of a valid type ([4c299c80](https://github.com/MichaelSolati/geofirestore/commit/4c299c807d876970df36dde50d6b56286b5c78ab))

##### Performance Improvements

* **examples:**  throttle queries to Firestore ([be8ab9a5](https://github.com/MichaelSolati/geofirestore/commit/be8ab9a52af9dc075ec3f1e1c4acbd3cac6e73f8))

##### Tests

* **GeoFirestoreQuery:**
  *  add tests for `_queryToString` and `_stringToQuery` ([44677f0c](https://github.com/MichaelSolati/geofirestore/commit/44677f0cacf1eed0572c51f0f52bbcc75fdcded5))
  *  use consts for query comparisons ([72531203](https://github.com/MichaelSolati/geofirestore/commit/7253120398b1fa7d595e0980981d53d2d609a584))
  *  add coverage for `query` function of QueryCriteria ([01cc594c](https://github.com/MichaelSolati/geofirestore/commit/01cc594c2051a3803de0b4673bc1c844e08f1d2a))
*  expand coverage for util functions ([12b10e59](https://github.com/MichaelSolati/geofirestore/commit/12b10e593781fb64cc366f9a7ba6e20bbcfdfecb))
* **GeoFirestore:**
  *  write better `remove` function tests ([e6b77890](https://github.com/MichaelSolati/geofirestore/commit/e6b77890b474ea008c510717eed556d72071df7a))
  *  add coverage for `remove` function ([da11c3b3](https://github.com/MichaelSolati/geofirestore/commit/da11c3b3e479d18e321aa031a9704f7ce880bb06))

#### 2.0.2 (2018-07-23)

##### Build System / Dependencies

*  add coveralls to testing process ([e670b279](https://github.com/MichaelSolati/geofirestore/commit/e670b279e072c00709968a9b3e6849cfcf5e98c5))

##### Documentation Changes

* **README:**  stop referencing `location` where `document` should be used ([72cc61af](https://github.com/MichaelSolati/geofirestore/commit/72cc61afdfb9e3f92b5f554e8fdea42231dacf3b))

##### Refactors

*  remove external dependency of firebase ([df31a871](https://github.com/MichaelSolati/geofirestore/commit/df31a871a62a8836d9905ccf108e1ee6b4c26113))

#### 2.0.1 (2018-07-23)

##### Build System / Dependencies

*  set browser build to iife ([7b0df7f0](https://github.com/MichaelSolati/geofirestore/commit/7b0df7f0d6d39ba5d73e55d0171c37d26013bf0d))

##### Documentation Changes

*  Fix minor typos in README.md ([1ed6d659](https://github.com/MichaelSolati/geofirestore/commit/1ed6d65993da7e12387181463029b649fe88173d))

##### Refactors

*  modify how firestore is imported ([8525def6](https://github.com/MichaelSolati/geofirestore/commit/8525def6418a2e71a632a874413fe88b69581a61))

## 2.0.0 (2018-07-18)

##### Build System / Dependencies

*  change build to use rollup ([dddb80a2](https://github.com/MichaelSolati/geofirestore/commit/dddb80a287d53efab9e5d598b5ce5f0647c402a2))
*  configure npm deploy for master AND tag ([7fd7c539](https://github.com/MichaelSolati/geofirestore/commit/7fd7c539f6344c7ed1754fd6e479c5336ee2e8e2))

##### Chores

* **release:**  minor version release ([81a9d979](https://github.com/MichaelSolati/geofirestore/commit/81a9d979d2857bd7374f0728952fd5707475cb80))
*  lock to firebase 5.x.x ([8779a2c7](https://github.com/MichaelSolati/geofirestore/commit/8779a2c762314aaf1f3c34042caefaa08cfaee0f))
*  bump firebase to v5.x.x ([1442de38](https://github.com/MichaelSolati/geofirestore/commit/1442de38fb667c1c3a13f0a08e8affda4bb15087))

##### Documentation Changes

*  update docs ([f040e981](https://github.com/MichaelSolati/geofirestore/commit/f040e98190572d3c62f1661713c59299e7683573))

##### New Features

* **query:**
  *  add 'on_modified' event, this fixes [#7](https://github.com/MichaelSolati/geofirestore/pull/7) ([8a69d9e8](https://github.com/MichaelSolati/geofirestore/commit/8a69d9e83664782dce00df4300ce36ea2f6c6b22))
  *  return document instead of just coordinates ([94fdc711](https://github.com/MichaelSolati/geofirestore/commit/94fdc711d040a4808be1946565af2cfdaf043270))
* **add:**  add ability to add/insert documents without set ([1663b0e1](https://github.com/MichaelSolati/geofirestore/commit/1663b0e1777093658ad16b90d975db295a980adc))
* **set:**  update set function to use GeoPoints ([5cf04fbd](https://github.com/MichaelSolati/geofirestore/commit/5cf04fbd445442fe8fe7c50aaae1c35df34d923b))
* **remove:**  update remove function to no longer depend on set function ([51814436](https://github.com/MichaelSolati/geofirestore/commit/51814436b61e1275e4ff85d17bf44d5e4954822e))
* **get:**  update get function to reflect new GeoFirestoreObj type ([ec4ac975](https://github.com/MichaelSolati/geofirestore/commit/ec4ac975feb9a278344a240863dbed79509d87a7))

##### Bug Fixes

*  tweak some validations ([7303a350](https://github.com/MichaelSolati/geofirestore/commit/7303a350d4097fb678578f815e41fe601a07755d))

##### Refactors

* **GeoFirestoreQuery:**  use Maps instead of Objects as well as general clean up ([2263bccd](https://github.com/MichaelSolati/geofirestore/commit/2263bccda9fa8bbe6a7e93c605e07b30060af94b))

##### Tests

*  update tests for new structure ([37600fb6](https://github.com/MichaelSolati/geofirestore/commit/37600fb6a9de903f144733f014fdb07490655e0d))

### 1.2.0 (2018-05-29)

##### Chores

*  lock to firebase 5.x.x ([295e9f7b](https://github.com/MichaelSolati/geofirestore/commit/295e9f7b3dd3aae227dcca089bb13cfefb0a2d40))
*  update dependencies ([b45d9e8e](https://github.com/MichaelSolati/geofirestore/commit/b45d9e8e6998b2391a9c9ad55d658e2eeb5ade03))

#### 1.1.1 (2018-05-24)

##### Bug Fixes

* **scripts:**  remove postinstall script ([d2712d36](https://github.com/MichaelSolati/geofirestore/commit/d2712d36e8edd067540d5e0fdc7948c93ccf6a7c))

### 1.1.0 (2018-05-24)

##### Build System / Dependencies

*  include dist in npm deploy ([0fe8aca3](https://github.com/MichaelSolati/geofirestore/commit/0fe8aca3da0069b607119839519b37fea045a484))

##### Chores

*  add scripts to generate changelogs and update version ([3b90de44](https://github.com/MichaelSolati/geofirestore/commit/3b90de4455a81307c95387528c2e3c6f9cc9ec4e))
*  add commit guidline and update readme to include contributing section ([6c519ad5](https://github.com/MichaelSolati/geofirestore/commit/6c519ad55a9211eb10441bfa4f30528cf5350fb8))
*  repurpose as a geofirestore npm package ([f887310c](https://github.com/MichaelSolati/geofirestore/commit/f887310c00faa3b723fac0185926c92687cb6196))

##### New Features

* **firestore:**  early implementation of geofirestore ([51e76bda](https://github.com/MichaelSolati/geofirestore/commit/51e76bdaeef3bad607f134498d8a92301efc436e))

##### Bug Fixes

* **firestore:**
  *  set data from snapshot to variable to pass into decode ([e750c65f](https://github.com/MichaelSolati/geofirestore/commit/e750c65f23947de979ec359b365d47e70bfefd31))
  *  fix single location removal by set function ([ffb377aa](https://github.com/MichaelSolati/geofirestore/commit/ffb377aab702dc80e45006b5dd1daf8f6f0dbee7))

##### Refactors

*  renamed folders and small tweaks ([261445e6](https://github.com/MichaelSolati/geofirestore/commit/261445e60ea2179f4735639f4b6c835bbbb6a354))
*  change vars to consts and use in instead of hasOwnProperty ([4a0d3127](https://github.com/MichaelSolati/geofirestore/commit/4a0d31278e85aa86d8ac4765f0f81d3474563bbf))

##### Tests

* **firestore:**
  *  modify "'key_exited' registrations can be cancelled" timing ([b5da5ee4](https://github.com/MichaelSolati/geofirestore/commit/b5da5ee427e5665a0afd76c8e119e027b39dc10d))
  *  implement test against realtime db to firestore ([b73d800e](https://github.com/MichaelSolati/geofirestore/commit/b73d800e48a0382465b7d7c1a28ddab448b7540b))
*  increase mocha timeout ([aa7b084e](https://github.com/MichaelSolati/geofirestore/commit/aa7b084eb6020e6169576f99baf6bf1c2486d3bf))
*  reintroduce coveralls support with tweaks ([361fc5b4](https://github.com/MichaelSolati/geofirestore/commit/361fc5b4cb605678d2a933d43d539f4d7766f17c))
*  fix tests for geofire callbacks and implement for geofirestore ([8c007d81](https://github.com/MichaelSolati/geofirestore/commit/8c007d81fba67dda70c7ba6b3511f3756eb182ab))
* **geofirestore:**  check location against array instead of object ([dd93bcde](https://github.com/MichaelSolati/geofirestore/commit/dd93bcde90bf33848dea9ccd2ff5678cd9b9ebb9))


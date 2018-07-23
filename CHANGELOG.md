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


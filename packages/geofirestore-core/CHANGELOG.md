## 5.0.0 (2022-02-09)

##### New Features

* **compat:**  update dependencies and use firebase v9 compat ([#4](https://github.com/MichaelSolati/geofirestore-core/pull/4)) ([8fbcb744](https://github.com/MichaelSolati/geofirestore-core/commit/8fbcb74448a57895bdbeacc908b58b804dc74b03))

#### 4.4.4 (2021-06-11)

##### Bug Fixes

* **release:**  reorder deploys ([72f3c9f5](https://github.com/MichaelSolati/geofirestore-core/commit/72f3c9f57da2487a50b155e006f8f92356d207a1))

#### 4.4.3 (2021-06-11)

##### Bug Fixes

* **release:**  set target for firebase deploy ([8eac6604](https://github.com/MichaelSolati/geofirestore-core/commit/8eac66044af95d053fddf52a291e934dad514781))

#### 4.4.2 (2021-06-11)

##### Bug Fixes

* **release:**  set `channelId` to `live` ([820605c7](https://github.com/MichaelSolati/geofirestore-core/commit/820605c736e93e730ce6e2c7a6152c0b92fa003c))

#### 4.4.1 (2021-06-11)

##### Build System / Dependencies

*  update release script ([fb75cd46](https://github.com/MichaelSolati/geofirestore-core/commit/fb75cd46a69169e73fd88eca31ebf3a154b2e223))

##### Chores

*  update dependencies ([bc0ab59d](https://github.com/MichaelSolati/geofirestore-core/commit/bc0ab59d076deee073525b81eb76a857b04ccdc9))

##### Code Style Changes

*  fix up code to pass linting test ([c0fbe334](https://github.com/MichaelSolati/geofirestore-core/commit/c0fbe3345c028d70da1039321a764fff4a73012a))

##### Tests

* **firebase:**  use emulator to run tests ([5e3d9f94](https://github.com/MichaelSolati/geofirestore-core/commit/5e3d9f94ea85a412d50597470a68d981ee41821c))

### 4.4.0 (2020-12-13)

##### Refactors

* **GeoFirestoreTypes:**  set WhereFilterOp from Firestore definition ([df1cd631](https://github.com/MichaelSolati/geofirestore-core/commit/df1cd631733ab1d1ab87e670298d0cd8e0498f6f))

### 4.3.0 (2020-11-23)

##### Chores

*  remove `@types/node` ([bd539374](https://github.com/MichaelSolati/geofirestore-core/commit/bd539374c6ced4cb84a94212f8ea9365e04d3526))

### 4.2.0 (2020-11-23)

##### Build System / Dependencies

*  update GitHub actions ([7bf52ac8](https://github.com/MichaelSolati/geofirestore-core/commit/7bf52ac8c1ad9632eaaf27006b320a6704b8d1f5))

##### Chores

*  update and lock dependencies ([745c55cc](https://github.com/MichaelSolati/geofirestore-core/commit/745c55cc28546a6cb931301824ffe7ac63ba9897))

##### New Features

* **firebase:**  add support for firebase 8, fixes [#3](https://github.com/MichaelSolati/geofirestore-core/pull/3), fixes MichaelSolati/geofirestore-js[#198](https://github.com/MichaelSolati/geofirestore-core/pull/198) ([8c238407](https://github.com/MichaelSolati/geofirestore-core/commit/8c2384078ab4892d55f7b8380c330e35f72cfb3e))

##### Bug Fixes

*  re-add `@types/node` ([3c095036](https://github.com/MichaelSolati/geofirestore-core/commit/3c095036c69c6b8f613ad4f177874a92e4240e62))

##### Tests

* **firebase:**  update firebase import in tests ([be5e026b](https://github.com/MichaelSolati/geofirestore-core/commit/be5e026b2b6388ef4a9536e8518de00f42f03cb1))
* **GeoQueryOnSnapshot:**  add tests for `api/query-on-snapshot.ts` ([deedd8f5](https://github.com/MichaelSolati/geofirestore-core/commit/deedd8f58adf5a8e51d576a6d5c967e99aadbbd9))
* **utils:**  add tests for util functions ([0adee9a5](https://github.com/MichaelSolati/geofirestore-core/commit/0adee9a5822d3164164c077c5aaada74d92576d7))

#### 4.1.2 (2020-08-01)

##### Bug Fixes

*  include comments in `dist/**/*.d.ts` files ([eea05c55](https://github.com/MichaelSolati/geofirestore-core/commit/eea05c552dd2abb343df8de35c07c936500edce8))

#### 4.1.1 (2020-08-01)

##### Chores

*  update dependencies ([00281184](https://github.com/MichaelSolati/geofirestore-core/commit/0028118478698606ac5b7afbd68ab92ef07c0c89))
*  lint and test on deploy ([487fe572](https://github.com/MichaelSolati/geofirestore-core/commit/487fe572542045f7ee89320ab9fecb051aa3bbc6))
*  run `Lint and Test` only on pull requests and pushes ([ee910ec7](https://github.com/MichaelSolati/geofirestore-core/commit/ee910ec7dc223325874a9755d8e01152d595977f))

##### Documentation Changes

* **definitions:**  add docs to all interfaces and types ([85205395](https://github.com/MichaelSolati/geofirestore-core/commit/85205395e5e6ea3a5a83d9285f048126e4d8ee47))

### 4.1.0 (2020-07-02)

##### Bug Fixes

* **encodeGeoDocument:**  clone object instead of mutating original, fixes [#1](https://github.com/MichaelSolati/geofirestore-core/pull/1) ([b6f64e7d](https://github.com/MichaelSolati/geofirestore-core/commit/b6f64e7df172a92a1d9e85f391fa5d3e55348a2f))

##### Refactors

*  move all exported functions to `/api` ([246cc642](https://github.com/MichaelSolati/geofirestore-core/commit/246cc64223965dc48c06a77275130ff1cc1080e1))

##### Tests

*  add tests for `api/validate.ts` ([8a9f6dbc](https://github.com/MichaelSolati/geofirestore-core/commit/8a9f6dbc990b5ae2b284282a827e64cab5653436))
*  add tests for `api/encode.ts` ([11e5667d](https://github.com/MichaelSolati/geofirestore-core/commit/11e5667d4d4e14a37a6157191b39ef7b0c8448e8))

## 4.0.0 (2020-06-22)

##### Build System / Dependencies

*  add deploy action ([9926225a](https://github.com/MichaelSolati/geofirestore-core/commit/9926225a7d192465c30f02ac370b6cec6b6b82f8))

##### Chores

*  update `geokit` ([ea198451](https://github.com/MichaelSolati/geofirestore-core/commit/ea198451bad2d2050f32152560722864605cf068))
*  add badges ([e9b3b7a7](https://github.com/MichaelSolati/geofirestore-core/commit/e9b3b7a73f1a162343372712a1d296a5533a6924))
*  initial commit ([fc04ad6c](https://github.com/MichaelSolati/geofirestore-core/commit/fc04ad6c4b33a94f1cb9215128a3bc17b6b4e1bb))

##### Documentation Changes

* **README:**  add description ([2c6a643e](https://github.com/MichaelSolati/geofirestore-core/commit/2c6a643e4de2482713e1eaf08a2f07087ee692ab))

##### New Features

*  add functions for `onSnapshot` and `get` for geoqueries ([e95be225](https://github.com/MichaelSolati/geofirestore-core/commit/e95be225de9c0f79b5988dfb83162a603cae0261))
* **encode:**  add functions to encode a document ([7c314692](https://github.com/MichaelSolati/geofirestore-core/commit/7c314692d543824976588d2785108bc9c83c9412))

##### Refactors

*  export specific functions from `/utils` ([3af42212](https://github.com/MichaelSolati/geofirestore-core/commit/3af42212000c996fb29eff80fe2c7d3215c631fa))

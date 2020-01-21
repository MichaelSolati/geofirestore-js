#### 3.4.1 (2020-01-21)

##### Bug Fixes

* **typescript:**  rollback to typescript 3.6.x, fixes [#156](https://github.com/geofirestore/geofirestore-js/pull/156) ([21b40d62](https://github.com/geofirestore/geofirestore-js/commit/21b40d629319516d3f5f38e6333de9c92556b182))

### 3.4.0 (2020-01-16)

##### Build System / Dependencies

* **deps:**
  *  bump mixin-deep from 1.3.1 to 1.3.2 ([1ba81a18](https://github.com/geofirestore/geofirestore-js/commit/1ba81a180bd3e752d91b525c29ad87e56d3d18e7))
  *  bump mixin-deep from 1.3.1 to 1.3.2 ([676f0794](https://github.com/geofirestore/geofirestore-js/commit/676f0794d9d2483677b67530f10dcaa4dfa64549))

##### Chores

*  loosen and update dependencies, use google typescript style guide ([9d848d75](https://github.com/geofirestore/geofirestore-js/commit/9d848d75c203b2ffc5894772a3b5f38c1971befb))
*  add `project.json` for firebaseopensource.com ([e0500546](https://github.com/geofirestore/geofirestore-js/commit/e05005464d16bc4538c4eacaedac72332af4ba6f))
*  update dependencies ([e29f80d7](https://github.com/geofirestore/geofirestore-js/commit/e29f80d74ce3cc91b77bcc494fee745c9f9a03c9))

##### Documentation Changes

*  fix typo ([6548096e](https://github.com/geofirestore/geofirestore-js/commit/6548096ed5bdc29c68381c5b3d3154b2ff09be09))
*  fix typo in README ([bd8a9389](https://github.com/geofirestore/geofirestore-js/commit/bd8a938904c49ef0bb23815bc4737c5ceccae93c))
* **README:**  add example to add a GeoDocument, fixes [#134](https://github.com/geofirestore/geofirestore-js/pull/134) ([e7c5d136](https://github.com/geofirestore/geofirestore-js/commit/e7c5d1362cf2a4284385a442d7fef3a455f4d465))

##### New Features

*  expose `native` classes ([29ef5c4a](https://github.com/geofirestore/geofirestore-js/commit/29ef5c4ade42ce4ce2ffa414d09c0fb8a16f04a5))

##### Bug Fixes

*  set `postinstall` to `pretest` for npm installs ([1fa16169](https://github.com/geofirestore/geofirestore-js/commit/1fa16169767f9c2dd9d1e5d2000d5609430bba35))

##### Tests

*  fix typing issues in tests ([d2131b5e](https://github.com/geofirestore/geofirestore-js/commit/d2131b5ef0cae26fabbc5a19294edc8cc45a4117))

#### 3.3.1 (2019-05-16)

##### Build System / Dependencies

*  copy modified `protobufjs` module into `@firebase/firestore`'s node modules ([6b05ccfc](https://github.com/geofirestore/geofirestore-js/commit/6b05ccfc320fab9c728870290f532dbc8ed19653))

##### Chores

*  extend support for firebase 6.x.x ([d0080f1a](https://github.com/geofirestore/geofirestore-js/commit/d0080f1ac0e57f9022b61e820b0b5c8c983c70ce))

##### Documentation Changes

* **README:**  update CDN and import sample ([256df9b7](https://github.com/geofirestore/geofirestore-js/commit/256df9b7107a50a161a4d354510bc99d442d1bf0))

##### Bug Fixes

* **GeoQuery:**  check if typeof `_radius` is "undefined" incase it is set to 0, fixes [#102](https://github.com/geofirestore/geofirestore-js/pull/102) ([62682118](https://github.com/geofirestore/geofirestore-js/commit/626821187c49c66ce23c6a146b872eee58b58295))

### 3.3.0 (2019-04-23)

##### Chores

*  tighten firestore rules ([941a8dd8](https://github.com/geofirestore/geofirestore-js/commit/941a8dd8dfd73400b005d3f96f7fbdadca7b6d74))

##### New Features

* **findCoordinates:**  `findCoordinatesKey` now `findCoordinates` as it returns GeoPoint rather than the key of the GeoPoint, can also find embedded keys, fixes [#88](https://github.com/geofirestore/geofirestore-js/pull/88) ([94161a4e](https://github.com/geofirestore/geofirestore-js/commit/94161a4e996ec4c9cb93c58201b67793e4b785b3))

##### Bug Fixes

*  very small typo in README ([69c9ae19](https://github.com/geofirestore/geofirestore-js/commit/69c9ae19c41aeba620815db035ea8a3e38adebc8))
*  very small typo in README ([f2266663](https://github.com/geofirestore/geofirestore-js/commit/f2266663d37e3da7c88b1d49327965600af49021))

##### Refactors

* **examples:**  update viewers firebase version and separate add/update functions ([f90c4cab](https://github.com/geofirestore/geofirestore-js/commit/f90c4cab381e29c8d9345973ad90c53512c35257))

#### 3.2.3 (2019-03-26)

##### Bug Fixes

*  sanitize `customKey` in `set` methods ([cee17d76](https://github.com/geofirestore/geofirestore-js/commit/cee17d76475a39738df2b719f82fcf1236b00232))

##### Refactors

* **test:**  lint test code ([1ed836a3](https://github.com/geofirestore/geofirestore-js/commit/1ed836a3295cadfa25bfa01c356375227d36cf91))

#### 3.2.2 (2019-02-17)

##### Bug Fixes

* **react-native-firebase:**  check if `docChanges` is an array ([fc1622e4](https://github.com/geofirestore/geofirestore-js/commit/fc1622e41a6afb9aa98c2be85e3b9bcd354506b4))

#### 3.2.1 (2019-02-11)

##### Chores

* **package.json:**  update homepage ([52df32b2](https://github.com/geofirestore/geofirestore-js/commit/52df32b2543ac974d1163fec52a502ddf838bd63))

##### Bug Fixes

* **travis:**  fix `after_deploy` script ([eaef13ef](https://github.com/geofirestore/geofirestore-js/commit/eaef13efced565bd3bde743c0388a33384484313))

### 3.2.0 (2019-02-10)

##### Build System / Dependencies

* **rollup:**  change copy plugin for `GeoFirestoreTypes.ts` ([2a585845](https://github.com/geofirestore/geofirestore-js/commit/2a585845e1b6fe1682c22e9380629cef3e591031))

##### Chores

*  update dependencies ([ca387c00](https://github.com/geofirestore/geofirestore-js/commit/ca387c0004b06f2f9a879ea42e9e9c599721326b))

##### Documentation Changes

*  add details to `README.md` and a code example for `runTransaction` ([167e0728](https://github.com/geofirestore/geofirestore-js/commit/167e0728d3fe1610bb817e9572e771e175606018))

##### New Features

* **GeoTransaction:**
  *  add remaining transaction functions ([6b1bbb8b](https://github.com/geofirestore/geofirestore-js/commit/6b1bbb8bb60260ff63dac0a4592d2fa95a34714b))
  *  add delete function ([e48a7427](https://github.com/geofirestore/geofirestore-js/commit/e48a742728c6ae2987deb802cf9b25c377aca9d8))
  *  stub GeoTransaction class ([0b68729e](https://github.com/geofirestore/geofirestore-js/commit/0b68729eaac78d57a8a379ff561c03fe47451e9e))

##### Bug Fixes

* **GeoFirestoreTypes:**  ignore `no-shadowed-variable` tslint rule, fixes [#83](https://github.com/geofirestore/geofirestore-js/pull/83) ([5e8684e5](https://github.com/geofirestore/geofirestore-js/commit/5e8684e5cb4319b7ec14cef57994c9fb38133836))

##### Refactors

* **GeoDocumentReference:**  reorder functions ([cc8cf1bf](https://github.com/geofirestore/geofirestore-js/commit/cc8cf1bfe8f3eb82205e781209077e3f0a181b5f))
* **GeoQuery:**  where() -> startAt() ([51be1b20](https://github.com/geofirestore/geofirestore-js/commit/51be1b20075f2bbbab7fc3424f06af9ce5997849))

##### Tests

* **GeoTransaction:**
  *  adjust timing of promise resolution, fixes [#72](https://github.com/geofirestore/geofirestore-js/pull/72) ([4d668500](https://github.com/geofirestore/geofirestore-js/commit/4d668500ec0c0624d657b1900f9fcae06f6dfde8))
  *  bring coverage to 100% ([b9a63743](https://github.com/geofirestore/geofirestore-js/commit/b9a63743c7901febc4653be2e27551a4fe40c35f))
* **GeoFirestore:**  add tests for `runTransaction` ([23f59ce8](https://github.com/geofirestore/geofirestore-js/commit/23f59ce85640ed7b78e66ec239e5936894b90e6b))

### 3.1.0 (2019-01-19)

##### Documentation Changes

* **README:**
  *  added limitations, fixes [#75](https://github.com/geofirestore/geofirestore-js/pull/75) ([aa5e320f](https://github.com/geofirestore/geofirestore-js/commit/aa5e320fb2d6ef422527c55f826e3b29bf1fb836))
  *  Added limitations ([659e2310](https://github.com/geofirestore/geofirestore-js/commit/659e2310413b18fe624ec90f5c0ff8c1ee70d363))

##### New Features

* **GeoQuery:**  expose limit function, fixes [#68](https://github.com/geofirestore/geofirestore-js/pull/68) [#26](https://github.com/geofirestore/geofirestore-js/pull/26) [#8](https://github.com/geofirestore/geofirestore-js/pull/8) ([5fb5de08](https://github.com/geofirestore/geofirestore-js/commit/5fb5de08833a6fe447a48b848e8baef8c7212767))

##### Bug Fixes

* **GeoJoinerOnSnapshot:**
  *  remove unchanged docs from ([133e3d60](https://github.com/geofirestore/geofirestore-js/commit/133e3d603c2b7a63b60c5383f1131b0e44b2e5cc))
  *  return properly computed `oldIndex` and `newIndex` ([ad9c657b](https://github.com/geofirestore/geofirestore-js/commit/ad9c657b6a7968695e1fd8f0f137cb02c2157584))

##### Tests

* **GeoQuery:**  add tests for new `limit` method ([d524789c](https://github.com/geofirestore/geofirestore-js/commit/d524789c8f27fc5d95e6fedd32600098d1bf37bb))

#### 3.0.2 (2019-01-15)

##### Chores

*  update dev dependencies ([92a4c7b6](https://github.com/geofirestore/geofirestore-js/commit/92a4c7b6fda2b0b6c4081dd6dcea77570f289259))

##### Bug Fixes

* **GeoJoinerOnSnapshot:**  emit snapshot on empty queries and update docs array when doc removed, fixes [#73](https://github.com/geofirestore/geofirestore-js/pull/73) ([85f2e260](https://github.com/geofirestore/geofirestore-js/commit/85f2e2605ac69a08c6653a53ae8160e3f151883f))

#### 3.0.1 (2019-01-03)

##### Chores

*  update dev dependencies ([b2ae17f4](https://github.com/geofirestore/geofirestore-js/commit/b2ae17f44cde95e421a45412122c9332907e9815))

##### Documentation Changes

* **README:**  fix typo and add dependency badge, fixes [#69](https://github.com/geofirestore/geofirestore-js/pull/69) ([55fd7bd3](https://github.com/geofirestore/geofirestore-js/commit/55fd7bd39c6276c069d4c22bb12d819299e81b54))

## 3.0.0 (2019-01-02)

##### Chores

* **README:**
  *  add some badges ([d1f2c220](https://github.com/geofirestore/geofirestore-js/commit/d1f2c220157dc9065bb914b575d5c314a0169ef7))
  *  update badges ([bb2aa25f](https://github.com/geofirestore/geofirestore-js/commit/bb2aa25fa6bc5e23d6d4805a982b35fa0a056926))
* **examples:**  update viewers example ([aed1a369](https://github.com/geofirestore/geofirestore-js/commit/aed1a36903717ae8aa15f3993d46adf6b86944c9))
*  update dependencies and typings ([36cd49d3](https://github.com/geofirestore/geofirestore-js/commit/36cd49d33bbaa1c2f116c00abccb3d551a3512ee))
*  generate and deploy docs site ([5273128f](https://github.com/geofirestore/geofirestore-js/commit/5273128f8dad518de10130808d44fa9b99931afd))

##### Documentation Changes

*  update README.md to reference https://geofirestore.com, as well as other tweaks ([d07efafc](https://github.com/geofirestore/geofirestore-js/commit/d07efafc765ba1ee7037c287207ef1564e34a3e7))
*  fix up docs and max all lines to 140 characters ([06af76c7](https://github.com/geofirestore/geofirestore-js/commit/06af76c77f9d4af56a5e9216ff33b9dc7a435eae))

##### New Features

* **GeoJoinerGet:**  move join logic of `get` functions to own class with logic to filter out items not in radius of query ([5716654a](https://github.com/geofirestore/geofirestore-js/commit/5716654a63078d3a5f852a4a3d5a34a9d9fe4f55))
* **GeoJoinerOnSnapshot:**  add ability to join `GeoQuerySnapshot` events from `onSnapshot` ([ba829244](https://github.com/geofirestore/geofirestore-js/commit/ba8292448c15612fa880ddb6079bea817c8e5b53))
* **GeoDocumentSnapshot:**  add GeoDocumentSnapshot for for doc references and queries ([1abb499b](https://github.com/geofirestore/geofirestore-js/commit/1abb499b0147144fc5c7c0ea386217cddffe4203))
* **GeoDocumentReference:**  add GeoDocumentReference for returns of doc and add ([9a5af9a5](https://github.com/geofirestore/geofirestore-js/commit/9a5af9a54aa463aec84dd436d29bcc9ad3f34e06))
* **GeoQuery:**  implement remaining Firestore Query functions ([3cd3e0e3](https://github.com/geofirestore/geofirestore-js/commit/3cd3e0e33efe28d9f6a8dcc69d8bde70ced91701))
* **GeoWriteBatch:**  add batch functionality to geofirestore ([f01de430](https://github.com/geofirestore/geofirestore-js/commit/f01de430bb6cdf8e924980afd2feb91519787825))
* **GeoQuerySnapshot:**  filter out locations not in query ([b0ce13cb](https://github.com/geofirestore/geofirestore-js/commit/b0ce13cb317af14dd5b671695d618415b299ad7d))
* **GeoFirestore:**  start rewrite to better align library to firestore sdk ([bf1d4273](https://github.com/geofirestore/geofirestore-js/commit/bf1d4273170e593ddef1da0d2c0fcbeef0e88586))

##### Bug Fixes

* **GeoFirestoreTypes:**  DocumentChange `doc` should return QueryDocumentSnapshot ([3b2e5d6c](https://github.com/geofirestore/geofirestore-js/commit/3b2e5d6cfc051c77c88e81471ccb58f929eeba9d))
* **GeoDocumentReference:**  fix update function to use encodeUpdateDocument util function ([97baf212](https://github.com/geofirestore/geofirestore-js/commit/97baf212f41442264190806f7523fcdb7daa9864))
* **GeoWriteBatch:**  fix update function to use fieldNames ([e27e668a](https://github.com/geofirestore/geofirestore-js/commit/e27e668ad89bb83bc6096fb93e147b0a584cf365))

##### Refactors

*  small change to `onSnapshot` and how geoqueries are generated ([7beffe69](https://github.com/geofirestore/geofirestore-js/commit/7beffe691588fa9db871cde3e95554624e141230))
*  simply GeoFirestoreTypes and remove incompatible GeoQuery functions ([0edef6de](https://github.com/geofirestore/geofirestore-js/commit/0edef6de4a1bf374c9e52606725a59a520376714))
* **GeoQuery:**  remove unneeded function ([76fa5af1](https://github.com/geofirestore/geofirestore-js/commit/76fa5af10ed8b4aca8348380c7e991cc42919df3))
* **GeoFirestoreTypes:**  rename and put together all interfaces into GeoFirestoreTypes ([9141fb37](https://github.com/geofirestore/geofirestore-js/commit/9141fb373dedcfd9006ef087a9c1c39efd8af3bb))

##### Tests

* **GeoJoinerOnSnapshot:**  increase code coverage ([27803b3a](https://github.com/geofirestore/geofirestore-js/commit/27803b3a6eb8616268a4328f654d39da1f009bfb))
* **utils:**  add code coverage for utils ([7872c290](https://github.com/geofirestore/geofirestore-js/commit/7872c290b406ca7d92ff3bae4bfc324e3d213357))
* **GeoDocumentSnapshot:**  bring coverage to 100% ([5caa5b10](https://github.com/geofirestore/geofirestore-js/commit/5caa5b1008618fb7e59e7a2cbb57d7264f21f0b7))
* **GeoDocumentReference:**  increase code coverage ([e9811ad1](https://github.com/geofirestore/geofirestore-js/commit/e9811ad13c989cf0b920ec1ff0b0dfb27e95d9d7))
* **GeoQuerySnapshot:**  bring coverage to 100% ([51122f9d](https://github.com/geofirestore/geofirestore-js/commit/51122f9d1a13ae5105ee17a218ebe8d6ebf11e09))
* **GeoQuery:**
  *  bring coverage to 100% ([6252222b](https://github.com/geofirestore/geofirestore-js/commit/6252222b569fbb159b69949800e705d29131d0aa))
  *  add basic tests for GeoQuery ([56cc5c44](https://github.com/geofirestore/geofirestore-js/commit/56cc5c44d0217e3f9a4a3f96a1da31c6bc76e351))
* **GeoCollectionReference:**  bring coverage to 100% ([47a17f6e](https://github.com/geofirestore/geofirestore-js/commit/47a17f6e0a938b4d5328a6594876c94bff7939c0))
* **GeoWriteBatch:**  create basic tests for GeoWriteBatch ([687c3061](https://github.com/geofirestore/geofirestore-js/commit/687c306153f434bcc59b1c1739e98b9954fecc78))
* **GeoFirestore:**  add basic tests for new GeoFirestore ([74f97d75](https://github.com/geofirestore/geofirestore-js/commit/74f97d75d40b283856cd1ef10128bfffd8f47911))

### 2.4.0 (2018-12-31)

##### New Features

* **GeoFirestoreQuery:**  add `error` listener for `on` function, fixes [#60](https://github.com/MichaelSolati/geofirestore/pull/60) ([b01d6906](https://github.com/MichaelSolati/geofirestore/commit/b01d69069505879e35c3964ead4b3954182a61f5))

##### Refactors

* **GeoFirestoreQuery:**  use `where` instead of `startAt` and `endAt`, fixes [#63](https://github.com/MichaelSolati/geofirestore/pull/63) ([f475fa01](https://github.com/MichaelSolati/geofirestore/commit/f475fa0100b5d4153f6cd01620c6c16a3cb930da))

### 2.3.0 (2018-12-17)

##### Documentation Changes

* **GeoFirestore:**  add docs for `update` function of `GeoFirestore` ([869e1893](https://github.com/MichaelSolati/geofirestore/commit/869e189368ce1312d178241bee40fe6cb3a1f46f))

##### New Features

* **GeoFirestore:**
  *  add ability to update documents, fixes [#52](https://github.com/MichaelSolati/geofirestore/pull/52) ([555c9bc4](https://github.com/MichaelSolati/geofirestore/commit/555c9bc48bfc35fd281168ad7bfdb64a7f4fbf38))
  *  add ability to update documents ([2f0b127e](https://github.com/MichaelSolati/geofirestore/commit/2f0b127eb7e8c2e04de06beba827a2e671ec7922))
  *  add ability to update documents ([d0a327df](https://github.com/MichaelSolati/geofirestore/commit/d0a327df96880cd4e287ae6883416cffe5d49e4c))

##### Refactors

* **utils:**  remove unused import, restore findCoordinatesKey ([324aa960](https://github.com/MichaelSolati/geofirestore/commit/324aa9604d6e9419711eac77d1014706eafe3791))
* **GeoFirestore:**  remove merge from batch.set ([7ed3586b](https://github.com/MichaelSolati/geofirestore/commit/7ed3586b895fc36d5ebf5a4f51a899bd5ffdfec1))

##### Code Style Changes

*  private method _ & alphabetical order ([716eda9e](https://github.com/MichaelSolati/geofirestore/commit/716eda9ed356cb1a078f6fc9fe1385b37973c6af))
* **geoFirestore:**  TS Lint ([d4ed971b](https://github.com/MichaelSolati/geofirestore/commit/d4ed971b7cc81017670f85770adf7b142d04495e))

##### Tests

* **GeoFirestore:**
  *  Corrected some EBKAC ([c9bf4f35](https://github.com/MichaelSolati/geofirestore/commit/c9bf4f351d907e5a4bf15d2916acda002f4d7f40))
  *  removed exit(); ([a739d254](https://github.com/MichaelSolati/geofirestore/commit/a739d25438c69f42384b7d71eafd6fa6ed86454c))
  *  add tests for `update`,validateDoc..HasCoordinates` ([77915930](https://github.com/MichaelSolati/geofirestore/commit/77915930cf7071220f05f90987738c80f073ae92))

#### 2.2.3 (2018-11-15)

##### Chores

* **README:**  update badges ([dfc9f1ba](https://github.com/MichaelSolati/geofirestore/commit/dfc9f1ba4f55cc054c161e2561fb2000fb649725))
*  update firebase settings and dependencies ([2b95d766](https://github.com/MichaelSolati/geofirestore/commit/2b95d766bd7fb5fa92ba0b7ada859468cca62999))
*  update `README.md` ([d55b979a](https://github.com/MichaelSolati/geofirestore/commit/d55b979ac8d8d07a7d3b3b67ee85f44915a39d66))
*  rename `COMMITS.md` to `CONTRIBUTING.md` ([f37e95ee](https://github.com/MichaelSolati/geofirestore/commit/f37e95ee305fe3e0f82c5b290f04caa8fba513c8))
* **LICENSE:**  update license ([7dc3064e](https://github.com/MichaelSolati/geofirestore/commit/7dc3064e674497334d0b2a47f767b1aefafcd59c))
* **COC:**  add a Code of Conduct ([e018ddba](https://github.com/MichaelSolati/geofirestore/commit/e018ddba42a5476669a7536d6ede378c8f508a1a))

##### Bug Fixes

* **lint:**  resolve linting issues in some firebase projects, fixes [#48](https://github.com/MichaelSolati/geofirestore/pull/48) ([a9fe161a](https://github.com/MichaelSolati/geofirestore/commit/a9fe161a377425d18806f0f470c22f8d46a7666a))

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


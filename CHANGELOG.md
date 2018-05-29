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


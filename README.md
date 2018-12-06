# geofirestore

[![npm version](https://badge.fury.io/js/geofirestore.svg)](https://badge.fury.io/js/geofirestore) [![Build Status](https://travis-ci.org/geofirestore/geofirestore-js.svg?branch=master)](https://travis-ci.org/geofirestore/geofirestore-js) [![Coverage Status](https://coveralls.io/repos/github/geofirestore/geofirestore-js/badge.svg?branch=master)](https://coveralls.io/github/geofirestore/geofirestore-js?branch=master)

GeoFirestore is an open-source library that allows you to store and query a set of keys based on their geographic location. At its heart, GeoFirestore simply stores locations with string keys. Its main benefit, however, is the possibility of retrieving only those keys within a given geographic area - all in realtime.

GeoFirestore uses the [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/) for data
storage, allowing query results to be updated in realtime as they change. GeoFirestore *selectively loads
only the data near certain locations, keeping your applications light and responsive*, even with
extremely large datasets.

GeoFirestore is designed as a lightweight add-on to Firebase. To keep things simple, GeoFirestore stores data
in its own format and its own location within your Firestore database. This allows your existing data
format and Security Rules to remain unchanged while still providing you with an easy solution for geo
queries.

## Table of Contents

* [Downloading GeoFirestore](#downloading-geofirestore)
* [Example Usage](#example-usage)
* [Documentation](#documentation)
* [Contributing](#contributing)

## Downloading GeoFirestore

You can install GeoFirestore via npm. You will have to install Firebase separately (because it is a peer dependency to GeoFirestore):

```bash
npm install geofirestore firebase --save
```

## Example Usage

Assume you are building an app to rate bars and you store all information for a bar, e.g. name, business hours and price range, and you want to add the possibility for users to search for bars in their vicinity. This is where GeoFirestore comes in. You can store each bar using GeoFirestore, using the location to build an easily queryable document. GeoFirestore then allows you to easily query which bars are nearby in a simalar fashion as `geofire` but will also return the bar information (not just the key or location).

### Examples

You can find a full list of our demos and view the code for each of them in the [examples directory](examples/) of this repository. The examples cover some of the common use cases for GeoFirestore.

## Documentation

* [`GeoFirestore`](#geofirestore)
  * [`new GeoFirestore(collectionRef)`](#new-geofirestorecollectionref)
  * [`ref()`](#geofirestoreref)
  * [`get(key)`](#geofirestoregetkey)
  * [`add(document[, customKey])`](#geofirestoreadddocument-customkey)
  * [`set(keyOrDocuments[, document, customKey])`](#geofirestoresetkeyordocuments-document-customkey)
  * [`update(keyOrDocuments[, document, customKey])`](#geofirestoreupdateexistingkeyordocuments-document-customkey)
  * [`remove(key)`](#geofirestoreremovekey)
  * [`query(queryCriteria)`](#geofirestorequeryquerycriteria)
* [`GeoFirestoreQuery`](#geofirestorequery)
  * [`center()`](#geofirestorequerycenter)
  * [`query()`](#geofirestorequeryquery)
  * [`radius()`](#geofirestorequeryradius)
  * [`updateCriteria(newQueryCriteria)`](#geofirestorequeryupdatecriterianewquerycriteria)
  * [`on(eventType, callback)`](#geofirestorequeryoneventtype-callback)
  * [`cancel()`](#geofirestorequerycancel)
* [`GeoCallbackRegistration`](#geocallbackregistration)
  * [`cancel()`](#geocallbackregistrationcancel)
* [Helper Methods](#helper-methods)
  * [`GeoFirestore.distance(location1, location2)`](#geofirestoredistancelocation1-location2)
* [Promises](#promises)

### GeoFirestore

A `GeoFirestore` instance is used to read and write geolocation data to your Firestore database and to create queries.

#### new GeoFirestore(collectionRef)

Creates and returns a new `GeoFirestore` instance to manage your location data. Data will be stored at
the collection defined by `collectionRef`. Note that this `collectionRef` must point to a collection in your Firestore Database.

```JavaScript
// Initialize the Firebase SDK
firebase.initializeApp({
  // ...
});

// Create a Firebase reference where GeoFirestore will store its information
const collectionRef = firebase.firestore().collection('geofirestore');

// Create a GeoFirestore index
const geoFirestore = new GeoFirestore(collectionRef);
```

#### GeoFirestore.add(document[, customKey])

Adds a document to this `GeoFirestore`. If you want to use a custom attribute as for the location pass the attribute as a string as the `customKey` argument.

Returns a promise which is fulfilled when the new document has been synchronized with the Firebase servers.

```JavaScript
geoFirestore.add({ coordinates: new firebase.firestore.GeoPoint(37.79, -122.41)}).then((docRef) => {
  console.log(docRef.id); // ID of newly added document
}, (error) => {
  console.log('Error: ' + error);
});
```

#### GeoFirestore.ref()

Returns the `Firestore` reference used to create this `GeoFirestore` instance.

```JavaScript
const collectionRef = firebase.firestore().collection('geofirestore');
const geoFirestore = new GeoFirestore(collectionRef);

const ref = geoFirestore.ref();  // ref === collectionRef
```

#### GeoFirestore.get(key[, options])

Fetches the document stored for `key`. If on web, by providing a `options` (GetOptions) object, this method can be configured to fetch results only from the server, only from the local cache or attempt to fetch results from the server and fall back to the cache (which is the default).

Returns a promise fulfilled with the `document` corresponding to the provided `key`. If `key` does not exist, the returned promise is fulfilled with `null`.

```JavaScript
geoFirestore.get('some_key').then((document) => {
  if (document === null) {
    console.log('Provided key is not in GeoFirestore');
  }
  else {
    console.log('Provided key\'s document is ' + document);
  }
}, (error) => {
  console.log('Error: ' + error);
});
```

#### GeoFirestore.set(keyOrDocuments[, document, customKey])

Adds the specified key - document pair(s) to this `GeoFirestore`. If the provided `keyOrDocuments` argument is a string, the single `document` will be added. The `keyOrDocuments` argument can also be an object containing a mapping between keys and documents allowing you to add several documents to GeoFirestore in one write. It is much more efficient to add several documents at once than to write each one individually.

If any of the provided keys already exist in this `GeoFirestore`, they will be overwritten with the new location values. Documents must have a `coordinates` field that is a Firestore GeoPoint.

If you want to use a custom attribute as for the location pass the attribute as a string as the `customKey` argument. Keep in mind that if you pass an object of key - document pairs, then your `document` object should be `null`.

Returns a promise which is fulfilled when the new document has been synchronized with the Firebase servers.

Keys must be strings and [valid Firstore id](https://firebase.google.com/docs/database/web/structure-data).

```JavaScript
geoFirestore.set('some_key', { coordinates: new firebase.firestore.GeoPoint(37.79, -122.41)}).then(() => {
  console.log('Provided key has been added to GeoFirestore');
}, (error) => {
  console.log('Error: ' + error);
});
```

```JavaScript
geoFirestore.set({
  'some_key':  { coordinates: new firebase.firestore.GeoPoint(37.79, -122.41)},
  'another_key':  { coordinates: new firebase.firestore.GeoPoint(36.98, -122.56)}
}).then(() => {
  console.log('Provided keys have been added to GeoFirestore');
}, (error) => {
  console.log('Error: ' + error);
});
```

#### GeoFirestore.update(existingKeyOrDocuments[, document, customKey])

Updates the specified key - document pair(s) in this `GeoFirestore`. If the provided `keyOrDocuments` argument is a string than a single `document` will be updated. The `keyOrDocuments` argument can also an object containing a mapping between keys and documents. Thus allowing you to add several documents to GeoFirestore in one write. 

Additional attributes can be updated or added to the `keyOrDocuments`. If any of the attributes pre-exist in the `document` -and are not (re)defined within the `keyOrDocuments` argument-, then those attributes will remain (unchanged). If merging of existing `document` data is not required, then [`GeoFirestore.set([..])`](#geofirestoresetkeyordocuments-document-customkey) is the more efficient choice.

This method returns a promise which is fulfilled when the new document has been synchronized with the Firebase servers. If the provided key(s) do not exist in `GeoFirestore`, the update will fail and the returned Promise will be rejected. If the document has a `coordinates` field to update, then it must be a valid Firestore GeoPoint. 

```JavaScript
geoFirestore.update('existing_key', {
    coordinates: new firebase.firestore.GeoPoint(37.79, -122.41),
    some_custom_key: 'text' // Add|update a custom key
}).then(() => {
    console.log('Document has been updated in GeoFirestore');
}, (error) => {
    console.log('Error: ' + error);
});
```

```JavaScript
geoFirestore.update('existing_key', {
    // Update coordinates only
    coordinates: new firebase.firestore.GeoPoint(52.09, -5.12)
}).then(() => {
    console.log('Document has been updated in GeoFirestore');
}, (error) => {
    console.log('Error: ' + error);
});
```

```JavaScript
geoFirestore.update({
    // Update multiple documents (with && witout coordinates)
    'existing_key': {
        custom_key: 'new text'
    },
    'another_existing_key': {
        coordinates: new firebase.firestore.GeoPoint(36.98, -122.56),
        other_key: 'text'
    }
}).then(() => {
    console.log('Provided documents have been updated in GeoFirestore');
}, (error) => {
    console.log('Error: ' + error);
});
```

#### GeoFirestore.remove(key)

Removes the provided `key` from this `GeoFirestore`. Returns a promise fulfilled when the removal of `key` has been synchronized with the Firebase servers. If the provided `key` is not present in this `GeoFirestore`, the promise will still successfully resolve.

This is equivalent to calling `set(key, null)` or `set({ <key>: null })`.

```JavaScript
geoFirestore.remove('some_key').then(() => {
  console.log('Provided key has been removed from GeoFirestore');
}, (error) => {
  console.log('Error: ' + error);
});
```

You may additionally pass in an array of keys to remove many documents at once.

#### GeoFirestore.query(queryCriteria)

Creates and returns a new `GeoFirestoreQuery` instance with the provided `queryCriteria`.

The `queryCriteria` describe a circular query and must be an object with the following keys:

* `center` - the center of this query, in the form of a Firestore GeoPoint
* `radius` - the radius, in kilometers, from the center of this query in which to include results

The `queryCriteria` optionally may include the following keys:

* `query` - the query, a function created by building on the [firebase.firestore.CollectionReference](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference).
  * Any field you wish to query on your original Document will be a sub object of the  `GeoFirestoreObj` and should be prefixed with `d.` in order to query it. So if I was to want to query on the count of a Document I would refer to it as `'d.count'`.
  * Firestore has [powerful querying syntax](https://firebase.google.com/docs/firestore/query-data/queries) and the `GeoFirestoreQuery`'s `QueryCriteria` provides a thin wrapper around it. This keeps you from having to learn two query syntax systems. If you know the [Firestore query API](https://firebase.google.com/docs/reference/js/firebase.firestore.Query) then you know how to query in GeoFirestore.
  * GeoFirestore queries locations on the `g` (geohash) field of a Document, In order to be able to query on an aditional field you must index your collection. For the aditional field remember that the field will be stored in the sub-object `d` and so must be indexed as [seen here](https://github.com/MichaelSolati/geofirestore/blob/dev/firestore.indexes.json#L3)
  * Updating your `query` function WILL NOT filter our documents by triggering the `key_exited` event. I'd read over this [issue](https://github.com/MichaelSolati/geofirestore/issues/35) to better understand this specific situation as well as [the full answer here.](https://github.com/MichaelSolati/geofirestore/issues/35#issuecomment-423521341)
  * The only query modifier that will work properly is the `where`s query modifier:
    * `orderBy` and related modifiers (`startAt`, `startAfter`, `endBefore`, `endAt`) will not work in any way, and will never return anything. As per [Michael Bleigh from the Firebase Team](https://stackoverflow.com/users/226391/michael-bleigh), "Because Cloud Firestore [doesn't support ordering by a different field than the supplied inequality](https://firebase.google.com/docs/firestore/query-data/order-limit-data), you won't be able to sort by name directly from the query. Instead you'd need to sort client-side once you've fetched the data." ([source](https://stackoverflow.com/a/47541800/5076023)
    * `limit` does not work because `geofirestore` wraps/scans hashes around the hash of your inputed center. That way if you're point is by the borderline of where a hash could be we don't miss areas right outside of the query. So if we're doing multiple queries in order to ensure that we have the full area covered then we will hit the `ref.limit` for each query (which will obvs be more than the initial `x` that you wanted).

```JavaScript
const geoQuery = geoFirestore.query({
  center: new firebase.firestore.GeoPoint(10.38, 2.41),
  radius: 10.5,
  query: (ref) => ref.where('d.count', '==', 1)
});
```

### GeoFirestoreQuery

A standing query that tracks a set of keys matching a criteria. A new `GeoFirestoreQuery` is created every time you call `GeoFirestore.query()`.

#### GeoFirestoreQuery.center()

Returns the `location` signifying the center of this query.

The returned `location` will be a Firestore GeoPoint.

```JavaScript
const geoQuery = geoFirestore.query({
  center: new firebase.firestore.GeoPoint(10.38, 2.41),
  radius: 10.5,
  query: (ref) => ref.where('d.count', '==', 1)
});

const center = geoQuery.center(); // center === GeoPoint { _lat: 10.38, _long: 2.41 }
```

#### GeoFirestoreQuery.query()

Returns a Firestore Query which you can read or listen to.

```JavaScript
const geoQuery = geoFirestore.query({
  center: new firebase.firestore.GeoPoint(10.38, 2.41),
  radius: 10.5,
  query: (ref) => ref.where('d.count', '==', 1)
});

const query = geoQuery.query();  // A query object
```

#### GeoFirestoreQuery.radius()

Returns the `radius` of this query, in kilometers.

```JavaScript
const geoQuery = geoFirestore.query({
  center: new firebase.firestore.GeoPoint(10.38, 2.41),
  radius: 10.5,
  query: (ref) => ref.where('d.count', '==', 1)
});

const radius = geoQuery.radius();  // radius === 10.5
```

#### GeoFirestoreQuery.updateCriteria(newQueryCriteria)

Updates the criteria for this query.

`newQueryCriteria` must be an object containing `center`, `radius`, `query`, or all three.

```JavaScript
const geoQuery = geoFirestore.query({
  center: new firebase.firestore.GeoPoint(10.38, 2.41),
  radius: 10.5,
  query: (ref) => ref.where('d.count', '==', 1)
});

let center = geoQuery.center();  // center === GeoPoint { _lat: 10.38, _long: 2.41 }
let radius = geoQuery.radius();  // radius === 10.5
const query = geoQuery.query();  // Firestore Query

geoQuery.updateCriteria({
  center: new firebase.firestore.GeoPoint(-50.83, 100.19),
  radius: 5
});

center = geoQuery.center();  // center === GeoPoint { _lat: -50.83, _long: 100.19 }
radius = geoQuery.radius();  // radius === 5
console.log(query.toString() === geoQuery.query().toString()); // true

geoQuery.updateCriteria({
  radius: 7,
  query: (ref) => ref.where('d.count', '==', 2)
});

center = geoQuery.center();  // center === GeoPoint { _lat: -50.83, _long: 100.19 }
radius = geoQuery.radius();  // radius === 7
console.log(query.toString() === geoQuery.query().toString()); // false
```

#### GeoFirestoreQuery.on(eventType, callback)

Attaches a `callback` to this query which will be run when the provided `eventType` fires. Valid `eventType` values are `ready`, `key_entered`, `key_exited`, `key_moved`, and `key_modified`. The `ready` event `callback` is passed no parameters. All other `callbacks` will be passed three parameters:

1. the document's key
2. the Firestore Document
3. the distance, in kilometers, from the location to this query's center

`ready` fires once when this query's initial state has been loaded from the server. The `ready` event will fire after all other events associated with the loaded data have been triggered. `ready` will fire again once each time `updateCriteria()` is called, after all new data is loaded and all other new events have been fired.

`key_entered` fires when a key enters this query. This can happen when a key moves from a location outside of this query to one inside of it or when a key is written to `GeoFirestore` for the first time and it falls within this query.

`key_exited` fires when a key moves from a location inside of this query to one outside of it. If the key was entirely removed from `GeoFirestore`, both the document and distance passed to the `callback` will be `null`.

`key_moved` fires when a key which is already in this query moves to another location inside of it.

`key_modified` fires when a key which is already in this query and the document has changed, while the location has stayed the same.

Returns a `GeoCallbackRegistration` which can be used to cancel the `callback`. You can add as many callbacks as you would like for the same `eventType` by repeatedly calling `on()`. Each one will get called when its corresponding `eventType` fires. Each `callback` must be cancelled individually.

```JavaScript
const onReadyRegistration = geoQuery.on('ready', () => {
  console.log('GeoFirestoreQuery has loaded and fired all other events for initial data');
});

const onKeyEnteredRegistration = geoQuery.on('key_entered', function(key, document, distance) {
  console.log(key + ' entered query at ' + document.coordinates.latitude + ',' + document.coordinates.longitude + ' (' + distance + ' km from center)');
});

const onKeyExitedRegistration = geoQuery.on('key_exited', function(key, document, distance) {
  console.log(key + ' exited query to ' + document.coordinates.latitude + ',' + document.coordinates.longitude + ' (' + distance + ' km from center)');
});

const onKeyMovedRegistration = geoQuery.on('key_moved', function(key, document, distance) {
  console.log(key + ' moved within query to ' + document.coordinates.latitude + ',' + document.coordinates.longitude + ' (' + distance + ' km from center)');
});

const onKeyModifiedRegistration = geoQuery.on('key_modified', function (key, document, distance) {
    console.log(key + ' in query has been modified');
  });
```

#### GeoFirestoreQuery.cancel()

Terminates this query so that it no longer sends location/document updates. All callbacks attached to this query via `on()` will be cancelled. This query can no longer be used in the future.

```JavaScript
// This example stops listening for all key events in the query once the first key leaves the query

const onKeyEnteredRegistration = geoQuery.on('key_entered', function(key, document, distance) {
  console.log(key + ' entered query at ' + document.coordinates.latitude + ',' + document.coordinates.longitude + ' (' + distance + ' km from center)');
});

const onKeyExitedRegistration = geoQuery.on('key_exited', function(key, document, distance) {
  console.log(key + ' exited query to ' + document.coordinates.latitude + ',' + document.coordinates.longitude + ' (' + distance + ' km from center)');

  // Cancel all of the query's callbacks
  geoQuery.cancel();
});
```

### GeoCallbackRegistration

An event registration which is used to cancel a `GeoFirestoreQuery.on()` callback when it is no longer needed. A new `GeoCallbackRegistration` is returned every time you call `GeoFirestoreQuery.on()`.

These are useful when you want to stop firing a callback for a certain `eventType` but do not want to cancel all of the query's event callbacks.

#### GeoCallbackRegistration.cancel()

Cancels this callback registration so that it no longer fires its callback. This has no effect on any other callback registrations you may have created.

```JavaScript
// This example stops listening for new keys entering the query once the first key leaves the query

const onKeyEnteredRegistration = geoQuery.on('key_entered', function(key, document, distance) {
  console.log(key + ' entered query at ' + document.coordinates.latitude + ',' + document.coordinates.longitude + ' (' + distance + ' km from center)');
});

const onKeyExitedRegistration = geoQuery.on('key_exited', function(key, document, distance) {
  console.log(key + ' exited query to ' + document.coordinates.latitude + ',' + document.coordinates.longitude + ' (' + distance + ' km from center)');

  // Cancel the 'key_entered' callback
  onKeyEnteredRegistration.cancel();
});
```

### Helper Methods

#### GeoFirestore.distance(location1, location2)

Static helper method which returns the distance, in kilometers, between `location1` and `location2`.

`location1` and `location1` must be in GeoPoint form.

```JavaScript
const location1 = new firebase.firestore.GeoPoint(10.3, -55.3);
const location2 = new firebase.firestore.GeoPoint(-78.3, 105.6);

const distance = GeoFirestore.distance(location1, location2);  // distance === 12378.536597423461
```

### Promises

GeoFirestore uses promises when writing and retrieving data. Promises represent the result of a potentially
long-running operation and allow code to run asynchronously. Upon completion of the operation, the
promise will be 'resolved' / 'fulfilled' with the operation's result. This result will be passed to
the function defined in the promise's `then()` method.

If you are unfamiliar with promises, check out [this blog post](http://www.html5rocks.com/en/tutorials/es6/promises/).
Here is a quick example of how to consume a promise:

```JavaScript
promise.then(function(result) {
  console.log('Promise was successfully resolved with the following value: ' + result);
}, (error) => {
  console.log('Promise was rejected with the following error: ' + error);
})
```

## Contributing

All code should pass tests, as well as be well documented. Please open PRs into the `dev` branch. [Please also see the Commit Message Guidelines](CONTRIBUTING.md) for how commit messages should be structured.

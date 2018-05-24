# API Reference | GeoFirestore for JavaScript

## Table of Contents

 * [`GeoFirestore`](#geofirestore)
   - [`new GeoFirestore(collectionRef)`](#new-geofirestorecollectionref)
   - [`ref()`](#geofirestoreref)
   - [`get(key)`](#geofirestoregetkey)
   - [`getWithDocument(key)`](#geofirestoregetwithdocumentkey)
   - [`set(keyOrLocations[, location])`](#geofirestoresetkeyorlocations-location)
   - [`setWithDocument(keyOrLocations[, location])`](#geofirestoresetwithdocumentkeyorlocations-location)
   - [`remove(key)`](#geofirestoreremovekey)
   - [`query(queryCriteria)`](#geofirestorequeryquerycriteria)
 * [`GeoFirestoreQuery`](#geofirestorequery)
   - [`center()`](#geofirestorequerycenter)
   - [`radius()`](#geofirestorequeryradius)
   - [`updateCriteria(newQueryCriteria)`](#geofirestorequeryupdatecriterianewquerycriteria)
   - [`on(eventType, callback)`](#geofirestorequeryoneventtype-callback)
   - [`cancel()`](#geofirestorequerycancel)
 * [`GeoCallbackRegistration`](#geocallbackregistration)
   - [`cancel()`](#geocallbackregistrationcancel)
 * [Helper Methods](#helper-methods)
   - [`GeoFirestore.distance(location1, location2)`](#geofirestoredistancelocation1-location2)
 * [Promises](#promises)


## GeoFirestore

A `GeoFirestore` instance is used to read and write geolocation data to your Firestore database and to create queries.

### new GeoFirestore(collectionRef)

Creates and returns a new `GeoFirestore` instance to manage your location data. Data will be stored at
the collection defined by `collectionRef`. Note that this `collectionRef` must point to a in your Firestore Collection.

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

### GeoFirestore.ref()

Returns the `Firestore` reference used to create this `GeoFirestore` instance.

```JavaScript
const collectionRef = firebase.firestore().collection('geofirestore');
const geoFirestore = new GeoFirestore(collectionRef);

const ref = geoFirestore.ref();  // ref === collectionRef
```

### GeoFirestore.get(key)

Fetches the location stored for `key`.

Returns a promise fulfilled with the `location` corresponding to the provided `key`. If `key` does not exist, the returned promise is fulfilled with `null`.

```JavaScript
geoFirestore.get('some_key').then((location) => {
  if (location === null) {
    console.log('Provided key is not in GeoFirestore');
  }
  else {
    console.log('Provided key has a location of ' + location);
  }
}, (error) => {
  console.log('Error: ' + error);
});
```

### GeoFirestore.getWithDocument(key)

Fetches the location with the document stored for `key`.

Returns a promise fulfilled with `{ key, location, document }` corresponding to the provided `key`. If `key` does not exist, the returned promise is fulfilled with `null`.

```JavaScript
geoFirestore.getWithDocument('some_key').then(({ key, location, document }) => {
  if (location === null) {
    console.log('Provided key is not in GeoFirestore');
  }
  else {
    console.log('Provided key has a location of ' + location);
  }
}, (error) => {
  console.log('Error: ' + error);
});
```

### GeoFirestore.set(keyOrLocations[, location])

Adds the specified key - location pair(s) to this `GeoFirestore`. If the provided `keyOrLocations` argument is a string, the single `location` will be added. The `keyOrLocations` argument can also be an object containing a mapping between keys and locations allowing you to add several locations to GeoFirestore in one write. It is much more efficient to add several locations at once than to write each one individually.

If any of the provided keys already exist in this `GeoFirestore`, they will be overwritten with the new location values. Locations must have the form `[latitude, longitude]`.

Returns a promise which is fulfilled when the new location has been synchronized with the Firebase servers.

Keys must be strings and [valid Firstore id](https://firebase.google.com/docs/database/web/structure-data).

```JavaScript
geoFirestore.set('some_key', [37.79, -122.41]).then(() => {
  console.log('Provided key has been added to GeoFirestore');
}, (error) => {
  console.log('Error: ' + error);
});
```

```JavaScript
geoFirestore.set({
  'some_key': [37.79, -122.41],
  'another_key': [36.98, -122.56]
}).then(() => {
  console.log('Provided keys have been added to GeoFirestore');
}, (error) => {
  console.log('Error: ' + error);
});
```

### GeoFirestore.setWithDocument(keyOrLocations[, location][, document])

Adds the specified key - obj pair(s) to this `GeoFirestore`. If the provided `keyOrLocations` argument is a string, the single `location` and `document` will be added. The `keyOrLocations` argument can also be an object containing a mapping between keys and locations allowing you to add several locations to GeoFirestore in one write. It is much more efficient to add several locations at once than to write each one individually.

If any of the provided keys already exist in this `GeoFirestore`, they will be overwritten with the new location and document values. Locations must have the form `{ location: [latitude, longitude], document: {} }`.

Returns a promise which is fulfilled when the new location has been synchronized with the Firebase servers.

Keys must be strings and [valid Firstore id](https://firebase.google.com/docs/database/web/structure-data).

```JavaScript
geoFirestore.setWithDocument('some_key', [37.79, -122.41], { name: 'Joe Blow' }).then(() => {
  console.log('Provided key has been added to GeoFirestore');
}, (error) => {
  console.log('Error: ' + error);
});
```

```JavaScript
geoFirestore.set({
  'some_key': { location: [37.79, -122.41], document: { name: 'Joe Blow' }},
  'another_key': { location: [36.98, -122.56], document: { name: 'Blow Joe' }}
}).then(() => {
  console.log('Provided keys have been added to GeoFirestore');
}, (error) => {
  console.log('Error: ' + error);
});
```

### GeoFirestore.remove(key)

Removes the provided `key` from this `GeoFirestore`. Returns a promise fulfilled when the removal of `key` has been synchronized with the Firebase servers. If the provided `key` is not present in this `GeoFirestore`, the promise will still successfully resolve.

This is equivalent to calling `set(key, null)` or `set({ <key>: null })`.

```JavaScript
geoFirestore.remove('some_key').then(() => {
  console.log('Provided key has been removed from GeoFirestore');
}, (error) => {
  console.log('Error: ' + error);
});
```

### GeoFirestore.query(queryCriteria)

Creates and returns a new `GeoFirestoreQuery` instance with the provided `queryCriteria`.

The `queryCriteria` describe a circular query and must be an object with the following keys:

* `center` - the center of this query, with the form `[latitude, longitude]`
* `radius` - the radius, in kilometers, from the center of this query in which to include results

```JavaScript
const geoQuery = geoFirestore.query({
  center: [10.38, 2.41],
  radius: 10.5
});
```

## GeoFirestoreQuery

A standing query that tracks a set of keys matching a criteria. A new `GeoFirestoreQuery` is created every time you call `GeoFirestore.query()`.

### GeoFirestoreQuery.center()

Returns the `location` signifying the center of this query.

The returned `location` will have the form `[latitude, longitude]`.

```JavaScript
const geoQuery = geoFirestore.query({
  center: [10.38, 2.41],
  radius: 10.5
});

const center = geoQuery.center();  // center === [10.38, 2.41]
```

### GeoFirestoreQuery.radius()

Returns the `radius` of this query, in kilometers.

```JavaScript
const geoQuery = geoFirestore.query({
  center: [10.38, 2.41],
  radius: 10.5
});

const radius = geoQuery.radius();  // radius === 10.5
```

### GeoFirestoreQuery.updateCriteria(newQueryCriteria)

Updates the criteria for this query.

`newQueryCriteria` must be an object containing `center`, `radius`, or both.

```JavaScript
const geoQuery = geoFirestore.query({
  center: [10.38, 2.41],
  radius: 10.5
});

let center = geoQuery.center();  // center === [10.38, 2.41]
let radius = geoQuery.radius();  // radius === 10.5

geoQuery.updateCriteria({
  center: [-50.83, 100.19],
  radius: 5
});

center = geoQuery.center();  // center === [-50.83, 100.19]
radius = geoQuery.radius();  // radius === 5

geoQuery.updateCriteria({
  radius: 7
});

center = geoQuery.center();  // center === [-50.83, 100.19]
radius = geoQuery.radius();  // radius === 7
```

### GeoFirestoreQuery.on(eventType, callback)

Attaches a `callback` to this query which will be run when the provided `eventType` fires. Valid `eventType` values are `ready`, `key_entered`, `key_exited`, and `key_moved`. The `ready` event `callback` is passed no parameters. All other `callbacks` will be passed four parameters:

1. the location's key
2. the location's [latitude, longitude] pair
3. the distance, in kilometers, from the location to this query's center
4. the document, if attached to the location

`ready` fires once when this query's initial state has been loaded from the server. The `ready` event will fire after all other events associated with the loaded data have been triggered. `ready` will fire again once each time `updateCriteria()` is called, after all new data is loaded and all other new events have been fired.

`key_entered` fires when a key enters this query. This can happen when a key moves from a location outside of this query to one inside of it or when a key is written to `GeoFirestore` for the first time and it falls within this query.

`key_exited` fires when a key moves from a location inside of this query to one outside of it. If the key was entirely removed from `GeoFirestore`, both the location and distance passed to the `callback` will be `null`.

`key_moved` fires when a key which is already in this query moves to another location inside of it.

Returns a `GeoCallbackRegistration` which can be used to cancel the `callback`. You can add as many callbacks as you would like for the same `eventType` by repeatedly calling `on()`. Each one will get called when its corresponding `eventType` fires. Each `callback` must be cancelled individually.

```JavaScript
const onReadyRegistration = geoQuery.on('ready', () => {
  console.log('GeoFirestoreQuery has loaded and fired all other events for initial data');
});

const onKeyEnteredRegistration = geoQuery.on('key_entered', function(key, location, distance, document) {
  console.log(key + ' entered query at ' + location + ' (' + distance + ' km from center)');
});

const onKeyExitedRegistration = geoQuery.on('key_exited', function(key, location, distance, document) {
  console.log(key + ' exited query to ' + location + ' (' + distance + ' km from center)');
});

const onKeyMovedRegistration = geoQuery.on('key_moved', function(key, location, distance, document) {
  console.log(key + ' moved within query to ' + location + ' (' + distance + ' km from center)');
});
```

### GeoFirestoreQuery.cancel()

Terminates this query so that it no longer sends location updates. All callbacks attached to this query via `on()` will be cancelled. This query can no longer be used in the future.

```JavaScript
// This example stops listening for all key events in the query once the
// first key leaves the query

const onKeyEnteredRegistration = geoQuery.on('key_entered', function(key, location, distance, document) {
  console.log(key + ' entered query at ' + location + ' (' + distance + ' km from center)');
});

const onKeyExitedRegistration = geoQuery.on('key_exited', function(key, location, distance, document) {
  console.log(key + ' exited query to ' + location + ' (' + distance + ' km from center)');

  // Cancel all of the query's callbacks
  geoQuery.cancel();
});
```

## GeoCallbackRegistration

An event registration which is used to cancel a `GeoFirestoreQuery.on()` callback when it is no longer needed. A new `GeoCallbackRegistration` is returned every time you call `GeoFirestoreQuery.on()`.

These are useful when you want to stop firing a callback for a certain `eventType` but do not want to cancel all of the query's event callbacks.

### GeoCallbackRegistration.cancel()

Cancels this callback registration so that it no longer fires its callback. This has no effect on any other callback registrations you may have created.

```JavaScript
// This example stops listening for new keys entering the query once the
// first key leaves the query

const onKeyEnteredRegistration = geoQuery.on('key_entered', function(key, location, distance, document) {
  console.log(key + ' entered query at ' + location + ' (' + distance + ' km from center)');
});

const onKeyExitedRegistration = geoQuery.on('key_exited', function(key, location, distance, document) {
  console.log(key + ' exited query to ' + location + ' (' + distance + ' km from center)');

  // Cancel the 'key_entered' callback
  onKeyEnteredRegistration.cancel();
});
```

## Helper Methods

### GeoFirestore.distance(location1, location2)

Static helper method which returns the distance, in kilometers, between `location1` and `location2`.

`location1` and `location1` must have the form `[latitude, longitude]`.

```JavaScript
const location1 = [10.3, -55.3];
const location2 = [-78.3, 105.6];

const distance = GeoFirestore.distance(location1, location2);  // distance === 12378.536597423461
```


## Promises

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
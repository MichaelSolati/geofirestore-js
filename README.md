# geofirestore

[![npm version](https://badge.fury.io/js/geofirestore.svg)](https://badge.fury.io/js/geofirestore) [![Build Status](https://travis-ci.org/geofirestore/geofirestore-js.svg?branch=master)](https://travis-ci.org/geofirestore/geofirestore-js) [![Coverage Status](https://coveralls.io/repos/github/geofirestore/geofirestore-js/badge.svg?branch=master)](https://coveralls.io/github/geofirestore/geofirestore-js?branch=master) [![dependencies Status](https://david-dm.org/geofirestore/geofirestore-js/status.svg)](https://david-dm.org/geofirestore/geofirestore-js) [![star this repo](https://githubbadges.com/star.svg?user=geofirestore&repo=geofirestore-js&style=flat)](https://github.com/geofirestore/geofirestore-js) [![fork this repo](https://githubbadges.com/fork.svg?user=geofirestore&repo=geofirestore-js&style=flat)](https://github.com/geofirestore/geofirestore-js/fork)

Full documentation is available at [https://geofirestore.com](https://geofirestore.com).

GeoFirestore is an open-source library that extends the Firestore library in order to store and query documents based on their geographic location. At its heart, GeoFirestore is just a wrapper for the Firestore library, exposing many of the same functions and features of Firestore. Its main benefit, however, is the possibility of retrieving only those documents within a given geographic area - all in realtime.

GeoFirestore uses the [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/) for data storage, allowing query results to be updated in realtime as they change. GeoFirestore *selectively loads only the data near certain locations, keeping your applications light and responsive*, even with extremely large datasets.

GeoFirestore is designed as a lightweight add-on to Firebase. To keep things simple, GeoFirestore stores data in its own format and its own location within your Firestore database.

## Table of Contents

* [Downloading GeoFirestore](#downloading-geofirestore)
* [Example Usage](#example-usage)
* [Documentation](#documentation)
* [Limitations & Considerations](#limitations--considerations)
  * [Data Structure](#data-structure)
  * [`limit()`](#limit)
* [Contributing](#contributing)

## Downloading GeoFirestore

You can install GeoFirestore via npm:

```bash
npm install geofirestore
```

Or you can use GeoFirestore via CDN:

```HTML
<script src="https://unpkg.com/geofirestore/dist/geofirestore.js"></script>
```

## Example Usage

Assume you are building an app to rate bars and you store all information for a bar, e.g. name, business hours and price range, and you want to add the possibility for users to search for bars in their vicinity. This is where GeoFirestore comes in. You can store each bar using GeoFirestore, using the location to build an easily queryable document. GeoFirestore then allows you to easily query which bars are nearby in a simalar fashion as `geofire` but will also return the bar information (not just the key or location).

### Examples

You can find a full list of our demos and view the code for each of them in the [examples directory](examples/) of this repository. The examples cover some of the common use cases for GeoFirestore.

## Documentation

Full documentation is available at [https://geofirestore.com](https://geofirestore.com). It mostly provides the same functionality as the Firestore library, in almost the same way as the Firestore library. Many questions can be addressed by looking at the [Firestore docs](https://firebase.google.com/docs/firestore/). However there are a few differences, and below is a little example of how to make a location based query.

```TypeScript
import * as firebase from 'firebase/app';
import 'firebase/firestore';

// If you're using ES6+/imports/ESM syntax for imports you can do this:
import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } from 'geofirestore';

// If you're using CommonJS/require syntax for imports you can do this:
const { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } = require('geofirestore');

// Initialize the Firebase SDK
firebase.initializeApp({
  // ...
});

// Create a Firestore reference
const firestore = firebase.firestore();

// Create a GeoFirestore reference
const geofirestore: GeoFirestore = new GeoFirestore(firestore);

// Create a GeoCollection reference
const geocollection: GeoCollectionReference = geofirestore.collection('restaurants');

// Add a GeoDocument to a GeoCollection
geocollection.add({
  name: 'Geofirestore',
  score: 100,
  // The coordinates field must be a GeoPoint!
  coordinates: new firebase.firestore.GeoPoint(40.7589, -73.9851)
})

// Create a GeoQuery based on a location
const query: GeoQuery = geocollection.near({ center: new firebase.firestore.GeoPoint(40.7589, -73.9851), radius: 1000 });

// Get query (as Promise)
query.get().then((value: GeoQuerySnapshot) => {
  // All GeoDocument returned by GeoQuery, like the GeoDocument added above
  console.log(value.docs);
});
```

Simple. Easy. And very similar with how Firestore handles a `get` from a Firestore `Query`. The difference being the added ability to say query `near` a `center` point, with a set `radius` in kilometers.


## Limitations & Considerations

Internally GeoFirestore creates multiple geohashes around a requested area. It queries them and furter calculations on the seperate results are done within the libary. Because of this the additional filtering methods such as `orderBy`, `startAt` and `endAt` can not be passed though GeoFirestore to [Cloud Firestore](https://firebase.google.com/docs/firestore/) at this time.

### Data Structure

GeoFirestore is based off of the `geofire` JavaScript library. Documents generated and stored in your Firestore collection by GeoFirestore are typed/structured as:

```TypeScript
interface GeoDocument {
    g: string;
    l: GeoPoint;
    d: DocumentData;
  }
```

* `g` is the geohash generated by the library, and is required in order to make the geoqery.
* `l` is the GeoPoint used to generate the `g` field.
* `d` is a sub-object which is where your data is stored.

Data must be structured this was in order to work, and is why you should use the GeoFirestore library to insert data in order to be able to query it.

### `limit()`

The `limit` filtering method is exposed through GeoFirestore, however there are some unique considerations when using it. Limits on geoqueries are applied based on the distance from the center. Geoqueries require an aggregation of queries. When performing a geoquery the library applies the limit on the client. This may mean you are loading to the client more documents then you intended. Use with this performance limitation in mind.

## Contributing

All code should pass tests, as well as be well documented. Please open PRs into the `dev` branch. [Please also see the Commit Message Guidelines](CONTRIBUTING.md) for how commit messages should be structured.

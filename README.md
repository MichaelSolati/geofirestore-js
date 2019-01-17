# geofirestore

[![npm version](https://badge.fury.io/js/geofirestore.svg)](https://badge.fury.io/js/geofirestore) [![Build Status](https://travis-ci.org/geofirestore/geofirestore-js.svg?branch=master)](https://travis-ci.org/geofirestore/geofirestore-js) [![Coverage Status](https://coveralls.io/repos/github/geofirestore/geofirestore-js/badge.svg?branch=master)](https://coveralls.io/github/geofirestore/geofirestore-js?branch=master) [![dependencies Status](https://david-dm.org/geofirestore/geofirestore-js/status.svg)](https://david-dm.org/geofirestore/geofirestore-js) [![star this repo](http://githubbadges.com/star.svg?user=geofirestore&repo=geofirestore-js&style=flat)](https://github.com/geofirestore/geofirestore-js) [![fork this repo](http://githubbadges.com/fork.svg?user=geofirestore&repo=geofirestore-js&style=flat)](https://github.com/geofirestore/geofirestore-js/fork)

Full documentation is available at [https://geofirestore.com](https://geofirestore.com).

GeoFirestore is an open-source library that allows extend the Firestore library in order to store and query documents based on their geographic location. At its heart, GeoFirestore is just a wrapper for the Firestore library, exposing many of the same functions and features of Firestore. Its main benefit, however, is the possibility of retrieving only those documents within a given geographic area - all in realtime.

GeoFirestore uses the [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/) for data storage, allowing query results to be updated in realtime as they change. GeoFirestore *selectively loads only the data near certain locations, keeping your applications light and responsive*, even with extremely large datasets.

GeoFirestore is designed as a lightweight add-on to Firebase. To keep things simple, GeoFirestore stores data in its own format and its own location within your Firestore database.

## Table of Contents

* [Downloading GeoFirestore](#downloading-geofirestore)
* [Example Usage](#example-usage)
* [Documentation](#documentation)
* [Contributing](#contributing)

## Downloading GeoFirestore

You can install GeoFirestore via npm:

```bash
npm install geofirestore
```

Or you can use GeoFirestore via CDN:

```HTML
<script src="https://unpkg.com/geofirestore@3.0.0/dist/geofirestore.js"></script>
```

## Example Usage

Assume you are building an app to rate bars and you store all information for a bar, e.g. name, business hours and price range, and you want to add the possibility for users to search for bars in their vicinity. This is where GeoFirestore comes in. You can store each bar using GeoFirestore, using the location to build an easily queryable document. GeoFirestore then allows you to easily query which bars are nearby in a simalar fashion as `geofire` but will also return the bar information (not just the key or location).

### Examples

You can find a full list of our demos and view the code for each of them in the [examples directory](examples/) of this repository. The examples cover some of the common use cases for GeoFirestore.

## Documentation

Full documentation is available at [https://geofirestore.com](https://geofirestore.com). It effectively provides all the same functionality as the Firestore library, in the same way as the Firestore library. Many questions can be addressed by looking at the [Firestore docs](https://firebase.google.com/docs/firestore/). However there are a few differences, and below is a little example of how to make a location based query.

```TypeScript
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } from 'geofirestore';

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

// Create a GeoQuery based on a location
const query: GeoQuery = geocollection.near({ center: new firebase.firestore.GeoPoint(40.7589, -73.9851), radius: 1000 });

// Get query (as Promise)
query.get().then((value: GeoQuerySnapshot) => {
  console.log(value.docs); // All docs returned by GeoQuery
});
```

Simple. Easy. And very similar with how Firestore handles a `get` from a Firestore `Query`. The only difference being is the added ability to say query `near` a `center` point, with a set `radius` in kilometers.

## Contributing

All code should pass tests, as well as be well documented. Please open PRs into the `dev` branch. [Please also see the Commit Message Guidelines](CONTRIBUTING.md) for how commit messages should be structured.

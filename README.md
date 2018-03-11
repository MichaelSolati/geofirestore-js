# GeoFirestore for JavaScript [![Build Status](https://travis-ci.org/MichaelSolati/geofirestore.svg?branch=master)](https://travis-ci.org/MichaelSolati/geofirestore) [![npm version](https://badge.fury.io/js/geofirestore.svg)](https://badge.fury.io/js/geofirestore)

GeoFirestore is an open-source library that allows you to store and query a set of keys based on their
geographic location. At its heart, GeoFirestore simply stores locations with string keys. Its main
benefit, however, is the possibility of retrieving only those keys within a given geographic
area - all in realtime.

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
 * [Documentation](#documentation)
 * [Example Usage](#example-usage)


## Downloading GeoFirestore

You can install GeoFirestore via npm. You will have to install Firebase separately (because it is a peer dependency to GeoFirestore):

```bash
$ npm install geofirestore firebase --save
```

## Documentation

* [API Reference](docs/reference.md)

### Example Usage

Assume you are building an app to rate bars and you store all information for a bar, e.g. name, business hours and price range, at `/bars/<bar-id>`. Later, you want to add the possibility for users to search for bars in their vicinity. This is where GeoFirestore comes in. You can store the location for each bar using GeoFirestore, using the bar IDs as GeoFirestore keys. GeoFirestore then allows you to easily query which bar IDs (the keys) are nearby. To display any additional information about the bars, you can load the information for each bar returned by the query at `/bars/<bar-id>`.
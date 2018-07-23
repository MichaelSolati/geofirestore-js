# Examples | GeoFirestore

GeoFirestore is an open-source library that allows you to store and query a set of keys based on their
geographic location. At its heart, GeoFirestore simply stores locations with string keys. Its main
benefit, however, is the possibility of retrieving only those keys within a given geographic
area - all in realtime.

GeoFirestore uses the [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/) for data
storage, allowing query results to be updated in realtime as they change. GeoFirestore *selectively loads
only the data near certain locations, keeping your applications light and responsive*, even with
extremely large datasets.

## Running Locally

To run the following examples locally, clone this entire `geofirestore` repository
and then simply open each example's respective `index.html` file in the browser
of your choice.

## [viewers - Writing To and Reading From GeoFire and Using a GeoQuery](viewers/)

This is a very basic example which shows you how to read from and write to GeoFirestore
and how to handle the promises returned by the `set()`, `get()`, and `remove()`
methods.

It also shows you how to create a `GeoFirestoreQuery` and respond to keys moving into,
out of, and within the query.

You can check out a live demo of this example [here](https://geofirestore.firebaseapp.com/viewers/index.html).
# GeoFirestore

[![npm](https://img.shields.io/npm/v/geofirestore)](https://www.npmjs.com/package/geofirestore)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/geofirestore)](https://bundlephobia.com/result?p=geofirestore)
[![Release CI](https://github.com/MichaelSolati/geofirestore-js/workflows/Release%20CI/badge.svg)](https://github.com/MichaelSolati/geofirestore-js/actions?query=workflow%3A%22Release+CI%22)
[![Coveralls github](https://img.shields.io/coveralls/github/MichaelSolati/geofirestore-js)](https://coveralls.io/github/MichaelSolati/geofirestore-js)
[![GitHub stars](https://img.shields.io/github/stars/MichaelSolati/geofirestore-js)](https://github.com/MichaelSolati/geofirestore-js/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/MichaelSolati/geofirestore-js)](https://github.com/MichaelSolati/geofirestore-js/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Full documentation is available at [https://geofirestore.com](https://geofirestore.com)**

GeoFirestore is an open-source library that extends the Firestore library to enable **real-time geospatial queries**. At its heart, GeoFirestore is a lightweight wrapper around Firestore that exposes the same familiar API while adding powerful location-based querying capabilities.

## ✨ Key Features

- 🔍 **Real-time geospatial queries** - Find documents within a specific radius
- 🚀 **Lightweight & performant** - Only loads data near specified locations
- 🔄 **Firestore compatible** - Works seamlessly with existing Firestore code
- 📱 **Cross-platform** - Supports both web and Node.js environments
- 🛡️ **Type-safe** - Full TypeScript support with comprehensive type definitions
- 📚 **Well documented** - Extensive API documentation and examples

## 🚀 Quick Start

### Installation

```bash
npm install geofirestore
```

### Basic Usage

```javascript
import { GeoFirestore } from 'geofirestore';

// Initialize GeoFirestore with your Firestore instance
const geofirestore = new GeoFirestore(firestore);

// Create a collection reference
const collection = geofirestore.collection('restaurants');

// Add a document with location data
await collection.add({
  name: 'Amazing Pizza Place',
  cuisine: 'Italian',
  rating: 4.5,
  coordinates: new firebase.firestore.GeoPoint(40.7589, -73.9851)
});

// Query for restaurants within 5km
const query = collection.near({
  center: new firebase.firestore.GeoPoint(40.7589, -73.9851),
  radius: 5 // 5km
});

const snapshot = await query.get();
console.log(snapshot.docs); // Restaurants within 5km
```

## 📦 Downloading GeoFirestore

### npm Installation

```bash
npm install geofirestore
```

### CDN Usage

```html
<script src="https://unpkg.com/geofirestore/dist/geofirestore.js"></script>
```

### Firebase Dependencies

#### Node.js Environment

Install `@google-cloud/firestore` with version >= 5.0.0 and < 6.0.0:

```bash
npm install @google-cloud/firestore@^5.0.0
```

#### Browser Environment

Install `firebase` with version >= 9.0.0 and < 10.0.0:

```bash
npm install firebase@^9.0.0
```

**Note:** Currently this library works with the Firebase Compat library. Support for the Firebase Modular library is coming soon.

## 🔧 Example Usage

### Restaurant Finder App

Imagine you're building an app to rate restaurants and want users to search for places in their vicinity. Here's how GeoFirestore makes it simple:

```javascript
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { GeoFirestore } from 'geofirestore';

// Initialize Firebase
firebase.initializeApp({
  // Your Firebase config
});

const firestore = firebase.firestore();
const GeoFirestore = new GeoFirestore(firestore);

// Create a GeoCollection reference
const restaurants = GeoFirestore.collection('restaurants');

// Add a restaurant with location
await restaurants.add({
  name: 'Pizza Palace',
  cuisine: 'Italian',
  rating: 4.8,
  priceRange: '$$',
  coordinates: new firebase.firestore.GeoPoint(40.7589, -73.9851)
});

// Find restaurants within 2km with rating > 4.0
const nearbyQuery = restaurants
  .near({ 
    center: new firebase.firestore.GeoPoint(40.7589, -73.9851), 
    radius: 2 
  })
  .where('rating', '>', 4.0)
  .limit(10);

// Get results
const snapshot = await nearbyQuery.get();
snapshot.docs.forEach(doc => {
  console.log(`${doc.data().name} - ${doc.data().rating} stars`);
});

// Real-time updates
const unsubscribe = nearbyQuery.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      console.log('New restaurant nearby:', change.doc.data().name);
    }
  });
});
```

## 📚 Documentation

### Full Documentation

Complete API documentation is available at **[https://geofirestore.com](https://geofirestore.com)**

### Examples

Check out the [examples directory](examples/) for comprehensive code samples covering common use cases.

## ⚠️ Limitations & Considerations

### Compound Queries

GeoFirestore creates multiple geohashes around a requested area and makes multiple inequality queries. Due to Firestore's limitations, **compound queries with inequalities or additional filtering methods** such as `orderBy`, `startAt`, and `endAt` are not supported.

For more details, see the [Firestore compound queries documentation](https://firebase.google.com/docs/firestore/query-data/queries#compound_queries).

### Data Structure

Documents stored by GeoFirestore follow this structure:

```typescript
interface GeoDocumentData {
  g: {
    geohash: string;    // Required for geo queries
    geopoint: GeoPoint; // Original coordinates
  };
  [field: string]: any; // Your custom data
}
```

**Important:** Always use GeoFirestore methods to insert data to ensure proper structure.

### Security Rules

Update your [Firebase Security Rules](https://firebase.google.com/docs/rules) to account for GeoFirestore's data structure:

```javascript
match /restaurants/{docId} {
  allow write: if request.auth != null
               && request.resource.data.g.size() == 2
               && request.resource.data.g.geohash is string
               && request.resource.data.g.geopoint is latlng
               && request.resource.data.coordinates is latlng;
}
```

### Limit() Considerations

The `limit()` method works with geoqueries but has performance implications:

- Limits are applied based on distance from center
- More documents may be loaded to the client than intended
- Use with performance considerations in mind

## 🤝 Contributing

We welcome contributions! Please follow our [CONTRIBUTING.md](../../CONTRIBUTING.md) guidelines.

### Commit Messages (Conventional Commits)

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard for commit messages. This helps us generate changelogs automatically and keep project history clear.

**Example:**

```
feat(geofirestore): add support for custom query filters
```

> **Note:** When your commit affects a specific package, use the package name as the scope (e.g., `geofirestore` or `geofirestore-core`).

See the root CONTRIBUTING.md for full details and allowed types.

### Development Workflow

1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feat/amazing-feature`
3. ✏️ Make your changes
4. 🧪 Run tests: `npm test`
5. 🔍 Run linting: `npm run lint`
6. 💾 Commit your changes: `git commit -m 'feat: add amazing feature'`
7. 📤 Push to the branch: `git push origin feat/amazing-feature`
8. 🔄 Open a Pull Request

### Code Style

This project uses:

- **TypeScript** for type safety
- **ESLint** with Google TypeScript Style (GTS) for linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE.md](../../LICENSE.md) file for details.

## 🔗 Links

- 📖 [Full Documentation](https://geofirestore.com/)
- 📦 [npm Package](https://www.npmjs.com/package/geofirestore)
- 🐛 [Issues](https://github.com/MichaelSolati/geofirestore-js/issues)
- 💬 [Discussions](https://github.com/MichaelSolati/geofirestore-js/discussions)
- ⭐ [GitHub Repository](https://github.com/MichaelSolati/geofirestore-js)

## 🙏 Acknowledgments

- Started as a fork of the original [GeoFire](https://github.com/firebase/geofire-js) library

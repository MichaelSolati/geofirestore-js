# GeoFirestore

[![Release CI](https://github.com/MichaelSolati/geofirestore-js/workflows/Release%20CI/badge.svg)](https://github.com/MichaelSolati/geofirestore-js/actions?query=workflow%3A%22Release+CI%22)
[![npm version](https://badge.fury.io/js/geofirestore.svg)](https://badge.fury.io/js/geofirestore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A monorepo containing the GeoFirestore JavaScript library for location-based querying and filtering using Firebase's Firestore.

## 📦 Packages

This monorepo contains the following packages:

- **`geofirestore`** - The main GeoFirestore library for location-based querying with Firestore

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
const collection = geofirestore.collection('cities');

// Add a document with location data
await collection.add({
  name: 'San Francisco',
  coordinates: new firebase.firestore.GeoPoint(37.7749, -122.4194),
  population: 873965
});

// Query for documents within a radius
const query = collection.near({
  center: new firebase.firestore.GeoPoint(37.7749, -122.4194),
  radius: 10000 // 10km
});

const snapshot = await query.get();
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/MichaelSolati/geofirestore-js.git
   cd geofirestore-js
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build all packages |
| `npm run test` | Run tests for all packages |
| `npm run lint` | Lint all packages |
| `npm run docs` | Generate documentation |
| `npm run clean` | Clean build artifacts |
| `npm run coverage` | Run tests with coverage |

### Project Structure

```text
geofirestore-js/
├── packages/
│   └── geofirestore/          # Main GeoFirestore library
│       ├── src/               # Source code
│       ├── test/              # Tests
│       ├── examples/          # Example usage
│       └── dist/              # Built output
├── .github/                   # GitHub workflows
├── nx.json                    # Nx workspace configuration
└── tsconfig.json             # TypeScript configuration
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test
```

### Test Environment

Tests use Firebase Firestore emulator to avoid requiring a live Firebase project. The test suite includes:

- Unit tests for all GeoFirestore classes
- Integration tests with Firestore emulator
- Performance benchmarks
- Edge case testing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'feat: add amazing feature'`
7. Push to the branch: `git push origin feat/amazing-feature`
8. Open a Pull Request

### Code Style

This project uses:

- **TypeScript** for type safety
- **ESLint** with Google TypeScript Style (GTS) for linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🔗 Links

- [Docs](https://geofirestore.com/)
- [npm Package](https://www.npmjs.com/package/geofirestore)
- [Issues](https://github.com/MichaelSolati/geofirestore-js/issues)

## 🙏 Acknowledgments

- Started as a fork of the original [GeoFire](https://github.com/firebase/geofire-js) library

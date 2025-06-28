import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GeoFirestore',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.esm.js';
          case 'umd':
            return 'geofirestore.js';
          default:
            return `index.${format}.js`;
        }
      },
    },
    rollupOptions: {
      external: ['@types/node', 'geofirestore-core'],
      output: {
        globals: {
          'geofirestore-core': 'GeoFirestoreCore',
        },
        extend: true,
      },
    },
    minify: 'terser',
    sourcemap: true,
    outDir: 'dist',
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
      outDir: 'dist',
    }),
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}); 
/// <reference types='vitest' />
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import {nxCopyAssetsPlugin} from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/geofirestore-core',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.json'),
    }),
  ],
  build: {
    outDir: '../../dist/packages/geofirestore-core',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'geofirestore-core',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.esm.js';
          case 'umd':
            return 'geofirestore-core.js';
          default:
            return `index.${format}.js`;
        }
      },
    },
    rollupOptions: {
      external: ['@types/node', 'geokit'],
      output: {
        globals: {
          geokit: 'geokit',
        },
      },
    },
  },
});

import commonjs from 'rollup-plugin-commonjs';
import rollupCopy from 'rollup-plugin-copy';
import resolveModule from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const plugins = [
  resolveModule(),
  typescript({
    typescript: require('typescript')
  }),
  commonjs()
];

const copy = rollupCopy({
  'src/GeoFirestoreTypes.ts': 'dist/GeoFirestoreTypes.ts'
});

const completeBuilds = [{
    input: 'src/index.ts',
    output: [{
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'window',
      extend: true
    },
    plugins: [
      ...plugins,
      uglify(),
      copy
    ]
  }
];

export default [...completeBuilds];
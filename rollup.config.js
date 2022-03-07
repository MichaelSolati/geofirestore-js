import resolve from '@rollup/plugin-node-resolve';
import typescriptPlugin from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';

import pkg from './package.json';

const onwarn = (warning, rollupWarn) => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
};

const typescript = (removeComments = false) =>
  typescriptPlugin({
    module: 'ESNext',
    removeComments,
    sourceMap: false,
  });

export default [
  // /admin
  {
    input: 'src/admin/index.ts',
    output: [
      {
        file: pkg.exports['./admin'].node.require,
        format: 'cjs',
      },
      {
        file: pkg.exports['./admin'].default,
        format: 'es',
      },
    ],
    external: ['@types/node', 'geofirestore-core'],
    plugins: [typescript()],
    onwarn,
  },
  // /compat
  {
    input: 'src/compat/index.ts',
    output: [
      {
        file: pkg.exports['./compat'].node.require,
        format: 'cjs',
      },
      {
        file: pkg.exports['./compat'].default,
        format: 'es',
      },
    ],
    external: ['@types/node', 'geofirestore-core'],
    plugins: [typescript()],
    onwarn,
  },
  {
    input: 'src/compat/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'window',
      extend: true,
    },
    external: ['@types/node'],
    plugins: [typescript(true), resolve(), terser()],
    onwarn,
  },
];

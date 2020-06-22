import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const onwarn = (warning, rollupWarn) => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
};

const ts = typescript({
  tsconfigOverride: {
    compilerOptions: {
      module: 'ESNext',
    },
  },
});

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
    external: ['@types/node', 'geofirestore-core'],
    plugins: [ts],
    onwarn,
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'window',
      extend: true,
    },
    external: ['@types/node'],
    plugins: [ts, resolve(), terser()],
    onwarn,
  },
];

import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    plugins: [esbuild()],
    input: 'src/index.ts',
    external: ['esbuild', 'esbuild-wasm'],
    output: [
      {
        file: `dist/index.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  {
    plugins: [dts()],
    input: 'src/index.ts',
    output: {
      file: `dist/index.d.ts`,
      format: 'es',
    },
  },
];

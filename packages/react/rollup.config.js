import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { string } from 'rollup-plugin-string';

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    plugins: [string({ include: 'src/**/*.txt' }), esbuild()],
    input: 'src/index.ts',
    external: ['react/jsx-runtime', 'react', 'react-dom/server', 'monaco-editor', '@monaco-editor/loader'],
    preserveSymlinks: true,
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

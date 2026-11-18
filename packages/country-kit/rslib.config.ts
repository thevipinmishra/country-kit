import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
      flags: './src/svg-flags.ts',
    },
  },
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
      redirect: { dts: { extension: true } },
    },
    {
      format: 'cjs',
      syntax: 'es2021',
      dts: { autoExtension: true, distPath: './dist/cjs' },
      redirect: { dts: { extension: true } },
    },
  ],
  output: {
    minify: true,
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
});

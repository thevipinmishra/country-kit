import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
      source: {
        entry: {
          index: './src/index.ts',
          flags: './src/svg-flags.ts',
        },
      },
      output: {
        minify: true,
      },
    },
    {
      format: 'cjs',
      syntax: 'es2021',
      source: {
        entry: {
          index: './src/index.ts',
          flags: './src/svg-flags.ts',
        },
      },
      output: {
        minify: true,
      },
    },
  ],
});

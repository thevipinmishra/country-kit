import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {},
  resolve: {
    alias: {
      'country-kit/flags': path.join(root, 'src/svg-flags.ts'),
      'country-kit': path.join(root, 'src/index.ts'),
    },
  },
});

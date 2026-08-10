import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    restoreMocks: true,
  },
});

import react from '@vitejs/plugin-react';
import type { UserConfig as ViteUserConfig } from 'vite';
import type { InlineConfig as VitestInlineConfig } from 'vitest/node';

/** Plain object (not `vitest/config`'s defineConfig) to avoid nested-vite plugin type clashes — same as design-system. */
type VitestConfig = ViteUserConfig & { test?: VitestInlineConfig };

export default {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
} satisfies VitestConfig;

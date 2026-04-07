import path from 'path';
import type { UserConfig as ViteUserConfig } from 'vite';
import type { InlineConfig as VitestInlineConfig } from 'vitest/node';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

/**
 * Use `defineConfig` from `vite` (not `vitest/config`) so plugins resolve against the same
 * `vite` install. Vitest nests its own `vite`; `vitest/config` overloads then clash with
 * `@vitejs/plugin-react` / `vite-plugin-svgr` types from the hoisted `vite`.
 */
type VitestConfig = ViteUserConfig & {test?: VitestInlineConfig};

const config: VitestConfig = {
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
      include: '**/*.svg?react',
    }),
  ],
  css: {
    modules: {
      // Return class names as-is for CSS modules in tests
      // This prevents "Could not parse CSS stylesheet" errors
      generateScopedName: (name: string) => name,
    },
    preprocessorOptions: {
      // SCSS will be processed by sass (already installed)
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@mobile/themes': path.resolve(__dirname, 'dist/mobile/themes'),
      '@mobile/typography': path.resolve(__dirname, 'dist/mobile/typography'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.{test,spec,a11y.test}.{ts,tsx}',
      '.storybook/**/*.test.{ts,tsx}',
      'scripts/**/*.test.{js,ts}',
    ],
    exclude: ['src/**/*.stories.{ts,tsx}', 'src/**/*.native.{test,a11y.test}.{ts,tsx}', 'node_modules'],
    // Override environment for script tests - they don't need jsdom/React
    testTimeout: 30000,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './test-coverage',
    },
    reporters: process.env.VITEST_REPORTERS
      ? process.env.VITEST_REPORTERS.split(',')
      : ['default', 'junit'],
    outputFile: {
      junit: process.env.VITEST_JUNIT_OUTPUT || './reports/junit.xml',
    },
  },
} satisfies VitestConfig;

export default config;

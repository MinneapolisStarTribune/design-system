import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
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
    exclude: ['src/**/*.stories.{ts,tsx}', 'node_modules'],
    // Override environment for script tests - they don't need jsdom/React
    testTimeout: 30000,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './test-coverage',
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: process.env.VITEST_JUNIT_OUTPUT || './reports/junit.xml',
    },
  },
});

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  // Include all stories, exclude native stories
  stories: ['../src/**/*.mdx', '../src/**/!(*.native).stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../dist/web'],

  async viteFinal(baseConfig) {
    // Plugin to convert CJS theme files (module.exports) to ESM (export default)
    // so they can be imported by tamagui.config.ts in the browser.
    // Must be pushed directly onto baseConfig.plugins — mergeConfig does not
    // reliably merge plugin arrays in all Storybook/Vite versions.
    baseConfig.plugins!.push({
      name: 'cjs-to-esm-theme-files',
      enforce: 'pre',
      load(id) {
        if (id.includes('/dist/mobile/themes/') && id.endsWith('.js')) {
          const code = fs.readFileSync(id, 'utf-8');
          return code.replace('module.exports =', 'export default');
        }
      },
    });

    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
      },
    });
  },
};

export default config;

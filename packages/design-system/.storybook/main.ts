import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import svgr from 'vite-plugin-svgr';
import {
  getCodeEditorStaticDirs,
  getExtraStaticDir,
} from 'storybook-addon-code-editor/getStaticDirs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  // Include all stories, exclude native stories
  stories: ['../src/**/*.mdx', '../src/**/!(*.native).stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', 'storybook-addon-code-editor'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: [
    ...getCodeEditorStaticDirs(__filename),
    // Extra static files sometimes needed by Monaco for its ES module loader.
    // Docs: https://storybook.js.org/addons/storybook-addon-code-editor
    getExtraStaticDir('monaco-editor/esm'),
    '../dist/web',
  ],

  async viteFinal(baseConfig) {
    // Plugin to convert CJS theme files (module.exports) to ESM (export default)
    // for any code that imports dist/mobile/themes in the browser.
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

    // Required so stories can import @/icons (barrel uses .svg?react)
    baseConfig.plugins!.push(
      svgr({
        svgrOptions: { icon: true },
        include: '**/*.svg?react',
      })
    );

    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          '@storybook-config': path.resolve(__dirname, '.'),
        },
      },
    });
  },
};

export default config;

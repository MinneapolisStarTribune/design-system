const path = require('path');
const Module = require('module');

module.exports = function (api) {
  api.cache(true);

  /**
   * In this monorepo, `babel-preset-expo` can be hoisted to the workspace root
   * while `expo` remains installed in this app workspace. Ensure Node resolves
   * `expo/config` from `apps/mobile-storybook/node_modules` during Babel preset
   * initialization.
   */
  const appNodeModules = path.resolve(__dirname, 'node_modules');
  const nodePathEntries = (process.env.NODE_PATH || '')
    .split(path.delimiter)
    .filter(Boolean);
  if (!nodePathEntries.includes(appNodeModules)) {
    process.env.NODE_PATH = nodePathEntries.length
      ? `${appNodeModules}${path.delimiter}${process.env.NODE_PATH}`
      : appNodeModules;
    Module._initPaths();
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@minneapolisstartribune/design-system/native':
              '../../packages/design-system/src/index.native',
            '@': '../../packages/design-system/src',
            // Token output from `yarn tokens` — design-system source imports these at build time
            '@mobile/themes': '../../packages/design-system/dist/mobile/themes',
            '@mobile/typography': '../../packages/design-system/dist/mobile/typography',
          },
        },
      ],
    ],
  };
};

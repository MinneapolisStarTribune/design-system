module.exports = function (api) {
  api.cache(true);
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

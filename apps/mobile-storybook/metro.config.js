const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const path = require('path');
const { resolve } = require('metro-resolver');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the entire monorepo so Metro can resolve workspace packages
config.watchFolders = [workspaceRoot];

// 2. Force Metro to resolve (sub)dependencies only from the current workspace
config.resolver.disableHierarchicalLookup = true;

// 3. withStorybook applies unstable_enablePackageExports only for storybook/@storybook
//    modules internally; we pass configPath so it finds .rnstorybook.
let merged = withStorybook(config, {
  enabled: true,
  onDisabledRemoveStorybook: true,
  configPath: path.resolve(projectRoot, '.rnstorybook'),
});

// 4. SVG as components (react-native-svg) — matches design-system `import x from './icon.svg?react'`
merged.transformer = {
  ...merged.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
merged.resolver.assetExts = merged.resolver.assetExts.filter((ext) => ext !== 'svg');
merged.resolver.sourceExts = [...merged.resolver.sourceExts, 'svg'];

const previousResolveRequest = merged.resolver.resolveRequest;
merged.resolver.resolveRequest = (context, moduleName, platform) => {
  if (typeof moduleName === 'string' && moduleName.includes('?react')) {
    const clean = moduleName.replace(/\?react$/, '');
    return previousResolveRequest
      ? previousResolveRequest(context, clean, platform)
      : resolve(context, clean, platform);
  }
  return previousResolveRequest
    ? previousResolveRequest(context, moduleName, platform)
    : resolve(context, moduleName, platform);
};

module.exports = merged;

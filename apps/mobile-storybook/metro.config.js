const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the entire monorepo so Metro can resolve workspace packages
config.watchFolders = [workspaceRoot];

// 2. Force Metro to resolve (sub)dependencies only from the current workspace
config.resolver.disableHierarchicalLookup = true;

// 3. withStorybook applies unstable_enablePackageExports only for storybook/@storybook
//    modules internally; we pass configPath so it finds .rnstorybook.
module.exports = withStorybook(config, {
  enabled: true,
  onDisabledRemoveStorybook: true,
  configPath: path.resolve(projectRoot, '.rnstorybook'),
});

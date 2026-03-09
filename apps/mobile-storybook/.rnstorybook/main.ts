import type { StorybookConfig } from '@storybook/react-native';

const config: StorybookConfig = {
  stories: [
    '../../../packages/design-system/src/**/*.native.stories.tsx',
  ],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
};

export default config;

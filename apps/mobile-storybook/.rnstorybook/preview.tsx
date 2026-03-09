import React from 'react';
import type { Preview } from '@storybook/react';
import {
  DesignSystemProvider,
  type Brand,
} from '@minneapolisstartribune/design-system/native';
import { BRANDS, MODES } from './constants';
import type { Mode } from './constants';

/**
 * Read the design system package version at build time.
 * This is displayed as a read-only label in the Storybook toolbar.
 */
const designSystemVersion: string =
  require('../../../packages/design-system/package.json').version;

const brandToolbarItems = BRANDS.map((b) => ({
  value: b,
  title: b.charAt(0).toUpperCase() + b.slice(1),
}));

const modeToolbarItems = MODES.map((m) => ({
  value: m,
  title: m.charAt(0).toUpperCase() + m.slice(1),
}));

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Brand theme for components',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: brandToolbarItems,
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Color scheme (light / dark)',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: modeToolbarItems,
        dynamicTitle: true,
      },
    },
    dsVersion: {
      description: 'Design system package version (read-only)',
      toolbar: {
        title: `v${designSystemVersion}`,
        icon: 'info',
        items: [{ value: 'current', title: `v${designSystemVersion}` }],
        dynamicTitle: false,
      },
    },
  },

  initialGlobals: {
    brand: 'startribune',
    mode: 'light',
    dsVersion: 'current',
  },

  decorators: [
    (Story, context) => {
      const brand = (context.globals.brand || 'startribune') as Brand;
      const mode = (context.globals.mode || 'light') as Mode;

      return (
        <DesignSystemProvider
          brand={brand}
          forceColorScheme={mode}
          disableFontInjection
        >
          <Story />
        </DesignSystemProvider>
      );
    },
  ],
};

export default preview;

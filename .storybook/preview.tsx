/**
 * Storybook Preview Configuration
 *
 * This file configures Storybook's preview environment for the design system.
 * It sets up global controls, decorators, and parameters that apply to all stories.
 *
 * Key Features:
 * 1. Global Toolbar Controls:
 *    - Brand selector: Switch between 'startribune' and 'varsity' themes
 *    - Theme selector: Switch between 'light' and 'dark' color schemes
 *
 * 2. Decorator Chain:
 *    - ThemeWrapper: Loads the correct CSS theme file based on brand/colorScheme
 *    - DesignSystemProvider: Provides Mantine theme configuration to components
 *    - ColorSchemeScript: Mantine's script for color scheme detection
 *    - Story: The actual story component being rendered
 *
 * 3. Theme Loading Flow:
 *    - User selects brand/theme in toolbar → context.globals updates
 *    - Decorator extracts brand and colorScheme from context
 *    - ThemeWrapper loads the corresponding CSS file (e.g., startribune-light.css)
 *    - CSS variables become available in the DOM
 *    - DesignSystemProvider creates Mantine theme from TypeScript token files
 *    - Components can now use both CSS variables and Mantine theme tokens
 *
 * 4. Why Both CSS Variables and Mantine Theme?
 *    - CSS Variables: Used by CSS modules and direct CSS styling
 *    - Mantine Theme: Used by Mantine components via their theme system
 *    - Both are needed because they serve different purposes in the component architecture
 *
 * 5. ArgTypes Configuration:
 *    - Hides certain props from Storybook controls that are internal/accessibility-focused
 *
 * 6. Parameters:
 *    - Controls: Matchers for better control UI (e.g., color picker for color props)
 *    - A11y: Accessibility testing configuration
 *    - Docs: Source code display settings
 */

import type { Preview } from '@storybook/react';
import React from 'react';
import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import { DesignSystemProvider, Brand } from '../src/providers/MantineProvider';
import { ThemeWrapper } from './theme-wrapper';
import { FontWrapper } from './font-wrapper';
import { BrandValidationErrorBoundary } from './BrandValidationErrorBoundary';

import versionsList from './versions.json';

type VersionsEntry = { version: string; url: string };

const versions = versionsList as VersionsEntry[];

const versionToolbarItems = [
  { value: 'current', title: 'Current' },
  ...versions.map((v) => ({ value: v.url, title: v.version })),
];

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Brand theme for components',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'startribune', title: 'Star Tribune' },
          { value: 'varsity', title: 'Varsity' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      name: 'Theme',
      description: 'Mantine color scheme',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
    versions: {
      description: 'Storybook version',
      toolbar: {
        title: 'Versions',
        icon: 'branch',
        dynamicTitle: true,
        items: versionToolbarItems,
      },
    },
  },
  initialGlobals: {
    brand: 'startribune',
    theme: 'light',
    versions: 'current',
  },
  decorators: [
    /**
     * Main decorator that wraps all stories with theme providers
     *
     * This decorator:
     * 1. Extracts brand and colorScheme from Storybook's global context
     * 2. Wraps the story in ThemeWrapper (loads CSS variables)
     * 3. Wraps in DesignSystemProvider (provides Mantine theme)
     * 4. Includes ColorSchemeScript for Mantine's color scheme detection
     * 5. Adds padding container for visual spacing in Storybook UI
     *
     * The order matters: ThemeWrapper must be outermost so CSS variables
     * are available before Mantine components try to use them.
     */
    (Story, context) => {
      const selectedVersion = context.globals.versions as string;
      if (typeof selectedVersion === 'string' && selectedVersion.startsWith('http')) {
        if (typeof window !== 'undefined') {
          (window.top || window).location.href = selectedVersion;
        }
        return <div>Redirecting...</div>;
      }

      const brand = (context.globals.brand || 'startribune') as Brand;
      const scheme = (context.globals.theme || 'light') as 'light' | 'dark';

      return (
        <ThemeWrapper brand={brand} colorScheme={scheme}>
          <FontWrapper brand={brand}>
            <DesignSystemProvider brand={brand} forceColorScheme={scheme}>
              <ColorSchemeScript />
              <div style={{ padding: '1rem' }}>
                <BrandValidationErrorBoundary>
                  <Story />
                </BrandValidationErrorBoundary>
              </div>
            </DesignSystemProvider>
          </FontWrapper>
        </ThemeWrapper>
      );
    },
  ],
  argTypes: {
    className: {
      table: { disable: true },
    },
    dataTestId: {
      table: { disable: true },
    },
    'aria-label': {
      table: { disable: true },
    },
    'aria-describedby': {
      table: { disable: true },
    },
    'aria-hidden': {
      table: { disable: true },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
export default preview;

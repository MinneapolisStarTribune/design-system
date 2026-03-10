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
 *    - FontWrapper: Loads brand-specific font CSS files
 *    - DesignSystemProvider: Provides Tamagui theme configuration to components
 *    - Story: The actual story component being rendered
 *
 * 3. Theme Loading Flow:
 *    - User selects brand/theme in toolbar → context.globals updates
 *    - Decorator extracts brand and colorScheme from context
 *    - ThemeWrapper loads the corresponding CSS file (e.g., startribune-light.css)
 *    - CSS variables become available in the DOM
 *    - DesignSystemProvider applies Tamagui theme based on brand and color scheme
 *    - Components can now use both CSS variables and Tamagui theme tokens
 *
 * 4. Why Both CSS Variables and Tamagui Theme?
 *    - CSS Variables: Used by CSS modules and direct CSS styling
 *    - Tamagui Theme: Used by Tamagui components via their theme system
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
import { DesignSystemProvider, Brand } from '../src/providers/DesignSystemProvider';
import { ThemeWrapper } from './theme-wrapper';
import { FontWrapper } from './font-wrapper';
import { BrandValidationErrorBoundary } from './BrandValidationErrorBoundary';
import { allModes } from './modes';
import './preview.css';

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
      description: 'Color scheme',
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
     * Theme decorator that provides brand and color scheme to all stories
     *
     * It:
     * 1. Reads brand and theme from story parameters first, then falls back to globals
     * 2. Wraps the story in ThemeWrapper (loads CSS variables)
     * 3. Wraps in FontWrapper (loads brand-specific fonts)
     * 4. Wraps in DesignSystemProvider (provides Tamagui theme)
     * 5. Adds padding container for visual spacing in Storybook UI
     *
     * The order matters: ThemeWrapper must be outermost so CSS variables
     * are available before components try to use them.
     */
    (Story, context) => {
      // Handle version redirect
      const selectedVersion = context.globals.versions as string;
      if (typeof selectedVersion === 'string' && selectedVersion.startsWith('http')) {
        if (typeof window !== 'undefined') {
          (window.top || window).location.href = selectedVersion;
        }
        return <div>Redirecting...</div>;
      }

      // Get brand from parameters first (story-level override), then fallback to globals.
      const brand = (context.parameters.brand || context.globals.brand || 'startribune') as Brand;

      // Get theme from parameters first (story-level override), then fallback to globals.
      const theme = (context.parameters.theme || context.globals.theme || 'light') as
        | 'light'
        | 'dark';

      // Expose globals for components that need brand/theme outside decorator context
      // (e.g., ThemeAwareColorCategory reads these during render)
      (window as any).__STORYBOOK_GLOBALS__ = { brand, theme };

      const layout = context.parameters.layout as string | undefined;
      const isFullscreen = layout === 'fullscreen';

      // Use CSS variables for background - these are loaded by ThemeWrapper
      // Fallback to white for light, black for dark if variables aren't loaded yet
      const backgroundColor =
        theme === 'dark'
          ? 'var(--color-background-dark-default, #0D0D0D)'
          : 'var(--color-background-light-default, #ffffff)';

      return (
        <div
          style={{
            padding: '1rem',
            backgroundColor,
            minHeight: '100%',
            ...(isFullscreen && { width: '100%', boxSizing: 'border-box' }),
          }}
        >
          <ThemeWrapper brand={brand} colorScheme={theme}>
            <FontWrapper brand={brand}>
              <DesignSystemProvider brand={brand} forceColorScheme={theme}>
                <BrandValidationErrorBoundary>
                  <Story />
                </BrandValidationErrorBoundary>
              </DesignSystemProvider>
            </FontWrapper>
          </ThemeWrapper>
        </div>
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
    chromatic: {
      modes: allModes,
    },
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
      codePanel: true,
      source: {
        type: 'dynamic',
      },
    },
  },
};
export default preview;

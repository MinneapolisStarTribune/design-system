import type { Preview } from '@storybook/react';
import React from 'react';
import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import { DesignSystemProvider, Brand } from '../src/providers/MantineProvider';
import { ThemeWrapper } from './theme-wrapper';

// Theme CSS is loaded dynamically by ThemeWrapper based on brand selection
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
  },
  initialGlobals: {
    brand: 'startribune',
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const brand = (context.globals.brand || 'startribune') as Brand;
      const scheme = (context.globals.theme || 'light') as 'light' | 'dark';
      
      return (
        <ThemeWrapper brand={brand}>
          <DesignSystemProvider brand={brand} forceColorScheme={scheme}>
            <ColorSchemeScript />
            <div style={{ 
              padding: '1rem'
            }}>
              <Story />
            </div>
          </DesignSystemProvider>
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

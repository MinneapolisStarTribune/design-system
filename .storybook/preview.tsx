import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeWrapper } from './theme-wrapper';

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
  },
  initialGlobals: {
    brand: 'startribune',
  },
  decorators: [
    (Story, context) => {
      const brand = context.globals.brand || 'startribune';
      return (
        <ThemeWrapper brand={brand}>
          <Story />
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
  },
};
export default preview;

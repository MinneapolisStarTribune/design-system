import React from 'react';
import type { Preview } from '@storybook/react';
import { StyleSheet, View } from 'react-native';
import {
  DesignSystemProvider,
  type Brand,
} from '@minneapolisstartribune/design-system/native';
import { BRANDS, MODES } from './constants';
import type { Mode } from './constants';


const brandControlOptions = [...BRANDS];
const modeControlOptions = [...MODES];

const preview: Preview = {
  /**
   * React Native Storybook does not consistently render toolbar globals in the
   * on-device UI. Expose brand/mode as project-level controls so they are
   * always available from the Controls addon panel.
   */
  args: {
    brand: 'startribune',
    mode: 'light',
  },

  argTypes: {
    brand: {
      description: 'Brand theme for components',
      control: { type: 'radio' },
      options: brandControlOptions,
    },
    mode: {
      description: 'Color scheme (light / dark)',
      control: { type: 'radio' },
      options: modeControlOptions,
    },
  },

  initialGlobals: {
    brand: 'startribune',
    mode: 'light',
    dsVersion: 'current',
  },

  decorators: [
    (Story, context) => {
      const brand = (
        context.args.brand ||
        context.globals.brand ||
        'startribune'
      ) as Brand;
      const globals = context.globals as Record<string, unknown> | undefined;
      const mode = (
        context.args.mode ??
        globals?.mode ??
        globals?.theme ??
        'light'
      ) as Mode;
      const canvasBackgroundColor = mode === 'dark' ? '#000000' : '#FFFFFF';

      return (
        <View style={[styles.canvas, { backgroundColor: canvasBackgroundColor }]}>
          <DesignSystemProvider
            brand={brand}
            forceColorScheme={mode}
            disableFontInjection
          >
            <View style={styles.storyContainer}>
              <Story />
            </View>
          </DesignSystemProvider>
        </View>
      );
    },
  ],
};

export default preview;

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  storyContainer: {
    flex: 1,
    padding: 4,
  },
});

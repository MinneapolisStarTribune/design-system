/**
 * Tamagui Configuration
 *
 * This config is scoped to components that use Tamagui internally (currently: Popover).
 * It is NOT a global provider — each Tamagui-based component wraps itself in its own
 * <TamaguiProvider> at the component level.
 *
 * Color tokens are loaded from the dist/mobile/themes/ files (already built by `yarn tokens`).
 * Only string-valued tokens (colors) are extracted for Tamagui themes — spacing and other
 * numeric tokens are handled by Style Dictionary's mobile output directly.
 */

// @ts-nocheck — dist/ is excluded from tsconfig; these are CommonJS modules
// that are always built before this file is consumed.
import { createTamagui, createTokens } from '@tamagui/core';
import { getSpacing, getBorderRadius } from './src/providers/theme-helpers';

import startribuneLight from './dist/mobile/themes/startribune-light.js';
import startribuneDark from './dist/mobile/themes/startribune-dark.js';
import varsityLight from './dist/mobile/themes/varsity-light.js';
import varsityDark from './dist/mobile/themes/varsity-dark.js';

/**
 * Convert numeric token objects to string token objects for Tamagui.
 */
function createStringTokens<T extends Record<string, number>>(
  numericTokens: T
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(numericTokens).map(([key, value]) => [key, String(value)])
  );
}

/**
 * Extract only string-valued tokens (colors) from a mobile theme file.
 * The mobile theme files contain all token types (colors, spacing, breakpoints, etc.)
 * but Tamagui themes only accept string values.
 */
function extractColors(tokens: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'string') {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Base tokens (spacing, radius) shared across all themes.
 */
const tokens = createTokens({
  space: createStringTokens(getSpacing()),
  radius: createStringTokens(getBorderRadius()),
});

/**
 * Theme variants for each brand/color scheme combination.
 */
const themes = {
  startribune_light: extractColors(startribuneLight),
  startribune_dark: extractColors(startribuneDark),
  varsity_light: extractColors(varsityLight),
  varsity_dark: extractColors(varsityDark),
};

export const config = createTamagui({
  tokens,
  themes,
  media: {
    small: { maxWidth: 767 },
    medium: { minWidth: 768, maxWidth: 1159 },
    large: { minWidth: 1160 },
  },
});

type Conf = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

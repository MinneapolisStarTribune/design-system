/**
 * Tamagui Configuration
 *
 * This file maps existing design tokens to Tamagui's theme system.
 *
 * The configuration supports:
 * - Brand switching: startribune, varsity
 * - Color scheme switching: light, dark
 * - All color palettes and semantic tokens
 * - Spacing and border radius tokens
 */

import { createTamagui, createTokens } from '@tamagui/core';
import { getSpacingAsNumbers, getBorderRadiusAsNumbers } from './src/providers/theme-helpers';
import * as startribuneLight from '@/generated/themes/startribune.light';
import * as startribuneDark from '@/generated/themes/startribune.dark';
import * as varsityLight from '@/generated/themes/varsity.light';
import * as varsityDark from '@/generated/themes/varsity.dark';

/**
 * Convert numeric token objects to string token objects for Tamagui
 * Reuses the same processing logic as mobile tokens (px already removed, values as numbers)
 * Converts numbers to strings for Tamagui token format
 */
function createStringTokens<T extends Record<string, number>>(
  numericTokens: T
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(numericTokens).map(([key, value]) => [key, String(value)])
  );
}

/**
 * Map spacing tokens to Tamagui format
 */
function createSpaceTokens() {
  const spacing = getSpacingAsNumbers();
  return createStringTokens(spacing);
}

/**
 * Map border radius tokens to Tamagui format
 */
function createRadiusTokens() {
  const radius = getBorderRadiusAsNumbers();
  return createStringTokens(radius);
}

/**
 * Extract all colors from a colors object and convert keys to camelCase
 * Just splats whatever tokens we have - no special handling for palettes vs semantic colors
 *
 * @param colors - Color object from generated theme file
 * @returns Object with camelCase keys and string color values
 */
function extractAllColors(
  colors:
    | typeof startribuneLight.colors
    | typeof varsityLight.colors
    | typeof startribuneDark.colors
    | typeof varsityDark.colors
): Record<string, string> {
  if (!colors || typeof colors !== 'object') {
    return {};
  }

  const result: Record<string, string> = {};

  Object.keys(colors).forEach((key) => {
    // Convert background-light-default: #aabbcc to backgroundLightDefault: #aabbcc
    const colorValue = colors[key as keyof typeof colors];
    result[kebabToCamel(key)] = colorValue;
  });

  return result;
}

/**
 * Convert kebab-case to camelCase
 * Examples:
 * - 'background-light-default' -> 'backgroundLightDefault'
 * - 'text-on-light-primary' -> 'textOnLightPrimary'
 * - 'border-on-light-subtle-01' -> 'borderOnLightSubtle01'
 */
function kebabToCamel(kebab: string): string {
  if (!kebab || kebab.length === 0) {
    return kebab;
  }

  return kebab
    .split('-')
    .filter((word) => word.length > 0) // Filter out empty strings from consecutive dashes
    .map((word, index) => {
      // First word stays lowercase, subsequent words are capitalized
      if (index === 0) {
        return word;
      }
      // Capitalize first letter, keep rest as-is (preserves numbers like '01')
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

/**
 * Create base tokens (spacing, radius) that are shared across all themes
 * Colors are handled per-theme, not in base tokens
 */
const tokens = createTokens({
  space: createSpaceTokens(),
  radius: createRadiusTokens(),
});

/**
 * Create theme variants for each brand/color scheme combination
 * Just splats all color tokens as camelCase - whatever is in the JSON gets converted
 */
const themeConfigs = [
  { name: 'startribune_light' as const, colors: startribuneLight.colors },
  { name: 'startribune_dark' as const, colors: startribuneDark.colors },
  { name: 'varsity_light' as const, colors: varsityLight.colors },
  { name: 'varsity_dark' as const, colors: varsityDark.colors },
] as const;

const themes = Object.fromEntries(
  themeConfigs.map(({ name, colors }) => [name, extractAllColors(colors)])
) as {
  startribune_light: Record<string, string>;
  startribune_dark: Record<string, string>;
  varsity_light: Record<string, string>;
  varsity_dark: Record<string, string>;
};

/**
 * Create Tamagui configuration
 */
export const config = createTamagui({
  tokens,
  themes,
  // Media queries for responsive design
  // Note: Width-based breakpoints (small, medium, large) are primarily for web.
  // In React Native, viewports don't resize, so these won't match dynamically.
  // Height and interaction-based queries (short, tall) work cross-platform.
  media: {
    // Width-based breakpoints (web-focused)
    small: { maxWidth: 767 },
    medium: { minWidth: 768, maxWidth: 1159 },
    large: { minWidth: 1160 },
  },
});

/**
 * Type safety: Extend Tamagui's type system with our custom config
 */
type Conf = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

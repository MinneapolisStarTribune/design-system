// @ts-nocheck
import * as startribuneLight from '../generated/themes/startribune.light';
import * as startribuneDark from '../generated/themes/startribune.dark';
import * as varsityLight from '../generated/themes/varsity.light';
import * as varsityDark from '../generated/themes/varsity.dark';
import spacingJson from '../../tokens/primitives/spacing.json';
import borderRadiusJson from '../../tokens/primitives/border-radius.json';

export const BRANDS = ['startribune', 'varsity'] as const;

export type Brand = (typeof BRANDS)[number];
export type ColorScheme = 'light' | 'dark';

/**
 * Get the color tokens for a specific brand and color scheme
 *
 * Note: All brand/mode combinations must have corresponding token files.
 * The build scripts (build-tokens.js and build-tamagui-tokens.js) require
 * all files to exist at build time. If a mode doesn't exist, the build will fail.
 *
 */
export function getBrandColors(brand: Brand, colorScheme: ColorScheme) {
  switch (brand) {
    case 'startribune':
      return colorScheme === 'light' ? startribuneLight.colors : startribuneDark.colors;
    case 'varsity':
      return colorScheme === 'light' ? varsityLight.colors : varsityDark.colors;
    default:
      return startribuneLight.colors;
  }
}

/**
 * Get spacing tokens as an object accessible by key (e.g., spacing['12'] = '12px')
 */
export function getSpacing(): Record<string, string> {
  const spacing = (spacingJson as any).spacing;
  if (!spacing) {
    return {};
  }

  const spacingMap: Record<string, string> = {};
  Object.entries(spacing).forEach(([key, token]: [string, any]) => {
    if (token?.value) {
      spacingMap[key] = token.value;
    }
  });

  return spacingMap;
}

/**
 * Get border radius tokens as an object accessible by key (e.g., radius['full'] = '999px')
 */
export function getBorderRadius(): Record<string, string> {
  const radius = (borderRadiusJson as any).radius;
  if (!radius) {
    return {};
  }

  const radiusMap: Record<string, string> = {};
  Object.entries(radius).forEach(([key, token]: [string, any]) => {
    if (token?.value) {
      radiusMap[key] = token.value;
    }
  });

  return radiusMap;
}

/**
 * Get spacing tokens as numbers (px suffix removed) - for use with mobile/Tamagui
 * This matches the format used in dist/mobile/themes/*.js files
 */
export function getSpacingAsNumbers(): Record<string, number> {
  const spacing = getSpacing();
  const spacingMap: Record<string, number> = {};

  Object.entries(spacing).forEach(([key, value]) => {
    if (typeof value === 'string' && value.endsWith('px')) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        spacingMap[key] = numericValue;
      }
    } else if (typeof value === 'string') {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        spacingMap[key] = numericValue;
      }
    }
  });

  return spacingMap;
}

/**
 * Get border radius tokens as numbers (px suffix removed) - for use with mobile/Tamagui
 * This matches the format used in dist/mobile/themes/*.js files
 */
export function getBorderRadiusAsNumbers(): Record<string, number> {
  const radius = getBorderRadius();
  const radiusMap: Record<string, number> = {};

  Object.entries(radius).forEach(([key, value]) => {
    if (typeof value === 'string' && value.endsWith('px')) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        radiusMap[key] = numericValue;
      }
    } else if (typeof value === 'string') {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        radiusMap[key] = numericValue;
      }
    }
  });

  return radiusMap;
}

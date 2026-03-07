// @ts-nocheck
import spacingJson from '../../tokens/primitives/spacing.json';
import borderRadiusJson from '../../tokens/primitives/border-radius.json';

export const BRANDS = ['startribune', 'varsity'] as const;

export type Brand = (typeof BRANDS)[number];
export type ColorScheme = 'light' | 'dark';

/**
 * Get spacing tokens as an object accessible by key (e.g., spacing['12'] = 12)
 * Returns integers for use with mobile tokens
 */
export function getSpacing(): Record<string, number> {
  const spacing = (spacingJson as any).spacing;
  if (!spacing) {
    return {};
  }

  const spacingMap: Record<string, number> = {};
  Object.entries(spacing).forEach(([key, token]: [string, any]) => {
    if (token?.value) {
      const value = token.value;
      // Handle numeric values (spacing tokens are now stored as numbers)
      if (typeof value === 'number') {
        spacingMap[key] = Math.round(value);
      }
      // Skip token references like "{spacing.44}" - they'll be resolved by Style Dictionary during build
      // and won't be available here since we're reading raw JSON
    }
  });

  return spacingMap;
}

/**
 * Get border radius tokens as an object accessible by key (e.g., radius['full'] = 999)
 * Returns integers for use with mobile tokens
 */
export function getBorderRadius(): Record<string, number> {
  const radius = (borderRadiusJson as any).radius;
  if (!radius) {
    return {};
  }

  const radiusMap: Record<string, number> = {};
  Object.entries(radius).forEach(([key, token]: [string, any]) => {
    if (token?.value) {
      const value = token.value;
      // Handle numeric values (border radius tokens are now stored as numbers)
      if (typeof value === 'number') {
        radiusMap[key] = Math.round(value);
      }
      // Skip token references - they'll be resolved by Style Dictionary during build
    }
  });

  return radiusMap;
}

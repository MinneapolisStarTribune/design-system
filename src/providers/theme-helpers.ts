import * as startribuneLight from '../generated/themes/startribune.light';
import * as startribuneDark from '../generated/themes/startribune.dark';
import * as varsityLight from '../generated/themes/varsity.light';
import * as varsityDark from '../generated/themes/varsity.dark';
import spacingJson from '../../tokens/spacing.json';
import borderRadiusJson from '../../tokens/border-radius.json';

export type Brand = 'startribune' | 'varsity';
export type ColorScheme = 'light' | 'dark';

/**
 * Get the color tokens for a specific brand and color scheme
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


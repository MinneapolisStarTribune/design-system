import { Brand, ColorScheme } from '../theme-helpers';

// Import token files from dist/mobile/themes/
// These are generated JS files, so TypeScript can't verify types at compile time
// @ts-expect-error - Generated file, types exist at runtime
import * as startribuneLightTokens from '@dist/mobile/themes/startribune-light.js';
// @ts-expect-error - Generated file, types exist at runtime
import * as startribuneDarkTokens from '@dist/mobile/themes/startribune-dark.js';
// @ts-expect-error - Generated file, types exist at runtime
import * as varsityLightTokens from '@dist/mobile/themes/varsity-light.js';
// @ts-expect-error - Generated file, types exist at runtime
import * as varsityDarkTokens from '@dist/mobile/themes/varsity-dark.js';

// Typography tokens (brand-specific)
// @ts-expect-error - Generated file, types exist at runtime
import startribuneTypography from '@dist/mobile/typography/startribune-typography.js';
// @ts-expect-error - Generated file, types exist at runtime
import varsityTypography from '@dist/mobile/typography/varsity-typography.js';

/**
 * Load color tokens for a brand/colorScheme combination
 * Returns an object with PascalCase keys (e.g., ColorButtonFilledBackground)
 * NO conversion - keeps native format from JS exports
 */
export function loadColorTokens(brand: Brand, colorScheme: ColorScheme): Record<string, string> {
  // Get the token module for this brand/colorScheme
  const tokens = 
    brand === 'startribune' && colorScheme === 'light' ? startribuneLightTokens :
    brand === 'startribune' && colorScheme === 'dark' ? startribuneDarkTokens :
    brand === 'varsity' && colorScheme === 'light' ? varsityLightTokens :
    varsityDarkTokens;
  
  const colors: Record<string, string> = {};
  
  Object.entries(tokens).forEach(([exportName, value]) => {
    if (exportName.startsWith('Color') && typeof value === 'string') {
      // Keep PascalCase format: "ColorButtonFilledBackground" → "ColorButtonFilledBackground"
      colors[exportName] = value;
    }
  });
  
  return colors;
}

/**
 * Load spacing tokens (same across all brands, now numbers)
 * Returns an object with PascalCase keys (e.g., Spacing12)
 * NO conversion - keeps native format from JS exports
 */
export function loadSpacingTokens(): Record<string, number> {
  // Spacing is the same across all brands, so use any token file
  const tokens = startribuneLightTokens;
  const spacing: Record<string, number> = {};
  
  Object.entries(tokens).forEach(([exportName, value]) => {
    if (exportName.startsWith('Spacing')) {
      // Keep PascalCase format: "Spacing12" → "Spacing12"
      // Values are already numbers (transform converted them)
      spacing[exportName] = typeof value === 'number' ? value : Number(value);
    }
  });
  
  return spacing;
}

/**
 * Load radius tokens (same across all brands, now numbers)
 * Returns an object with PascalCase keys (e.g., RadiusFull)
 * NO conversion - keeps native format from JS exports
 */
export function loadRadiusTokens(): Record<string, number> {
  // Radius is the same across all brands, so use any token file
  const tokens = startribuneLightTokens;
  const radius: Record<string, number> = {};
  
  Object.entries(tokens).forEach(([exportName, value]) => {
    if (exportName.startsWith('Radius')) {
      // Keep PascalCase format: "RadiusFull" → "RadiusFull"
      // Values are already numbers (transform converted them)
      radius[exportName] = typeof value === 'number' ? value : Number(value);
    }
  });
  
  return radius;
}

/**
 * Load typography tokens by brand
 * Returns nested object structure (e.g., { articleBody: { bold: {...}, h1: {...} } })
 */
export function loadTypographyTokens(brand: Brand) {
  return brand === 'startribune' ? startribuneTypography : varsityTypography;
}

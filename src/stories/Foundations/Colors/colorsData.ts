// @ts-nocheck
/**
 * ⚠️ IMPORTANT: This file is ONLY for displaying colors in Storybook documentation.
 *
 * This file is NOT used in production code. It processes color tokens from JSON files
 * to create data structures used by Storybook stories for displaying color palettes.
 *
 * For production code, colors should be accessed through the Mantine theme system
 * via useMantineTheme() or the DesignSystemProvider, which properly handles
 * brand-specific and theme-aware color resolution.
 */

import primitivesColorsJson from '../../../../tokens/color/global.json';
import buttonColorsJson from '../../../../tokens/color/button-light.json';

export interface ColorData {
  name: string;
  value: string;
}

export interface PrimitiveColorFamily {
  name: string;
  shades: Record<string, string>;
}

// Helper function to resolve a single token reference like "{color.base.white}" to actual value
function resolveSingleTokenReference(ref: string, additionalColors?: any): string {
  if (!ref.startsWith('{') || !ref.endsWith('}')) {
    return ref; // Not a token reference, return as-is
  }

  // Remove braces: "{color.base.white}" -> "color.base.white"
  const path = ref.slice(1, -1).split('.');

  // Navigate through the JSON structure, including additional colors if provided
  let current: any = {
    color: {
      ...primitivesColorsJson.color,
      ...(additionalColors?.color || {}),
    },
  };

  for (const segment of path) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment];
    } else {
      return ref; // Path not found, return original reference
    }
  }

  // If we found a token object with a value, return it
  if (current && typeof current === 'object' && 'value' in current) {
    // If the value is another reference, resolve it recursively
    if (typeof current.value === 'string' && current.value.startsWith('{')) {
      return resolveSingleTokenReference(current.value, additionalColors);
    }
    return current.value;
  }

  return ref; // Fallback to original reference
}

// Helper function to resolve token references like "{color.base.white}" to actual values
function resolveTokenReference(ref: string, additionalColors?: any): string {
  // If it's a simple token reference (starts and ends with braces), resolve it directly
  if (ref.startsWith('{') && ref.endsWith('}')) {
    return resolveSingleTokenReference(ref, additionalColors);
  }

  // Otherwise, look for token references within the string (e.g., in gradients)
  const tokenPattern = /\{([^}]+)\}/g;

  return ref.replace(tokenPattern, (match) => {
    return resolveSingleTokenReference(match, additionalColors);
  });
}

if (!primitivesColorsJson?.color) {
  console.error('primitivesColorsJson structure is invalid:', primitivesColorsJson);
}

export const primitivesColors: PrimitiveColorFamily[] = primitivesColorsJson?.color
  ? Object.entries(primitivesColorsJson.color).map(([colorName, shades]) => {
      const shadeEntries = Object.entries(shades as Record<string, { value: string }>);
      const shadesObj: Record<string, string> = {};

      shadeEntries.forEach(([shade, token]) => {
        // Use shade number as key for ColorItem compatibility
        shadesObj[shade] = token.value;
      });

      return {
        name: colorName
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        shades: shadesObj,
      };
    })
  : [];

// Extract base colors (black and white) from the global colors
export const baseColors: ColorData[] = primitivesColorsJson?.color?.base
  ? Object.entries(primitivesColorsJson.color.base).map(([colorName, token]) => ({
      name: colorName.charAt(0).toUpperCase() + colorName.slice(1),
      value: (token as { value: string }).value,
    }))
  : [];

export interface ButtonColorData extends ColorData {
  tokenName: string;
}

// Extract button colors from the button-light.json file
export const buttonColors: ButtonColorData[] = buttonColorsJson?.color?.button
  ? Object.entries(buttonColorsJson.color.button).map(([tokenName, token]) => {
      const resolvedValue = resolveTokenReference(
        (token as { value: string }).value,
        buttonColorsJson
      );
      return {
        name: tokenName
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        tokenName,
        value: resolvedValue,
      };
    })
  : [];

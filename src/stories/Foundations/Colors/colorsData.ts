import baseColorsJson from '../../../../tokens/color/base.json';
import primitivesColorsJson from '../../../../tokens/color/global.json';

export interface ColorData {
  name: string;
  value: string;
}

export interface PrimitiveColorFamily {
  name: string;
  shades: Record<string, string>;
}

// Helper function to resolve a single token reference like "{color.base.white}" to actual value
function resolveSingleTokenReference(ref: string): string {
  if (!ref.startsWith('{') || !ref.endsWith('}')) {
    return ref; // Not a token reference, return as-is
  }

  // Remove braces: "{color.base.white}" -> "color.base.white"
  const path = ref.slice(1, -1).split('.');

  // Navigate through the JSON structure
  let current: any = { color: { ...baseColorsJson.color, ...primitivesColorsJson.color } };

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
      return resolveSingleTokenReference(current.value);
    }
    return current.value;
  }

  return ref; // Fallback to original reference
}

// Helper function to resolve token references like "{color.base.white}" to actual values
function resolveTokenReference(ref: string): string {
  // If it's a simple token reference (starts and ends with braces), resolve it directly
  if (ref.startsWith('{') && ref.endsWith('}')) {
    return resolveSingleTokenReference(ref);
  }

  // Otherwise, look for token references within the string (e.g., in gradients)
  const tokenPattern = /\{([^}]+)\}/g;

  return ref.replace(tokenPattern, (match) => {
    return resolveSingleTokenReference(match);
  });
}

// Validate JSON structure before processing
if (!baseColorsJson?.color?.base) {
  console.error('baseColorsJson structure is invalid:', baseColorsJson);
}

if (!primitivesColorsJson?.color) {
  console.error('primitivesColorsJson structure is invalid:', primitivesColorsJson);
}

export const baseColors: ColorData[] = baseColorsJson?.color?.base
  ? Object.entries(baseColorsJson.color.base).map(([name, token]: [string, { value: string }]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: token.value,
    }))
  : [];

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

export interface ButtonColorData extends ColorData {
  tokenName: string;
}

export const buttonColors: ButtonColorData[] = baseColorsJson?.color?.button
  ? Object.entries(baseColorsJson.color.button).map(
      ([name, token]: [string, { value: string }]) => {
        const resolvedValue = resolveTokenReference(token.value);
        return {
          name: name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          tokenName: name,
          value: resolvedValue,
        };
      }
    )
  : [];

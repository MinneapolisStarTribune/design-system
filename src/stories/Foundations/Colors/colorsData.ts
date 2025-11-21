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
        const displayName = `${colorName.replace(/-/g, ' ')} ${shade}`;
        shadesObj[displayName] = token.value;
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

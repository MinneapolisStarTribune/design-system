// @ts-nocheck
import {
  createTheme,
  MantineThemeOverride,
  colorsTuple,
  defaultVariantColorsResolver,
  VariantColorsResolver,
  Button,
} from '@mantine/core';
import { getBrandColors, Brand, ColorScheme, getSpacing, getBorderRadius } from './theme-helpers';

// Constants
const COLOR_PALETTES = [
  'neutral',
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'emerald-green',
  'spring-green',
  'forest-green',
  'sky-blue',
  'cobalt-blue',
  'purple',
  'base',
] as const;

// Button variant configurations
type ButtonVariantConfig = {
  color: string;
  variant: string;
  tokenPrefix: string;
  includeBorder?: boolean;
};

const BUTTON_VARIANT_CONFIGS: ButtonVariantConfig[] = [
  { color: 'neutral', variant: 'filled', tokenPrefix: 'button-filled' },
  { color: 'neutral', variant: 'outlined', tokenPrefix: 'button-outlined', includeBorder: true },
  { color: 'neutral', variant: 'ghost', tokenPrefix: 'button-ghost' },
  { color: 'brand', variant: 'filled', tokenPrefix: 'control-brand' },
  { color: 'brand-accent', variant: 'filled', tokenPrefix: 'control-brand-accent', includeBorder: true },
];

/**
 * Ensure color arrays have at least 10 colors for Mantine compatibility
 */
function ensureMantineColorArray(
  colors: readonly string[],
  key: string,
  brand: Brand,
  colorScheme: ColorScheme
): string[] {
  if (colors.length === 0) {
    console.warn(
      `⚠️  Warning: "${key}" is an empty array in ${brand}-${colorScheme} tokens.`
    );
    return [];
  }

  if (colors.length === 1) {
    return [...colorsTuple(colors[0])] as string[];
  }

  if (colors.length < 10) {
    const lastColor = colors[colors.length - 1];
    return [...colors, ...colorsTuple(lastColor).slice(colors.length)] as string[];
  }

  return [...colors] as string[];
}

/**
 * Separate palette colors from semantic color tokens
 */
function processColors(
  colorsRecord: Record<string, readonly string[]>,
  brand: Brand,
  colorScheme: ColorScheme
) {
  const palettes: Record<string, string[]> = {};
  const semanticColors: Record<string, string[]> = {};

  Object.keys(colorsRecord).forEach((key) => {
    const value = colorsRecord[key];
    const isPalette = COLOR_PALETTES.includes(key as any);

    if (isPalette && Array.isArray(value)) {
      palettes[key] = [...value] as string[];
    } else if (Array.isArray(value)) {
      semanticColors[key] = ensureMantineColorArray(value, key, brand, colorScheme);
    }
  });

  return { palettes, semanticColors };
}

/**
 * Find brand color key with multiple possible naming patterns
 */
function findBrandKey(
  colorsRecord: Record<string, readonly string[]>,
  patterns: string[]
): string | undefined {
  return Object.keys(colorsRecord).find((key) =>
    patterns.some((pattern) => key === pattern || key.includes(pattern))
  );
}

/**
 * Map brand colors to convenient theme names
 * Brand colors use the first 4 colors, then pad to 10 with brand-04 duplicates
 * Note: We can't use ensureMantineColorArray directly because it generates shades,
 * but we want duplicates of brand-04 instead.
 */
function mapBrandColors(
  themeColors: Record<string, string[]>,
  semanticColors: Record<string, string[]>,
  colorsRecord: Record<string, readonly string[]>,
  _brand: Brand,
  _colorScheme: ColorScheme
) {
  // Process brand palette: take first 4 colors and pad to 10 with duplicates
  if (themeColors.brand && Array.isArray(themeColors.brand) && themeColors.brand.length > 0) {
    const firstFour = themeColors.brand.slice(0, 4);
    if (firstFour.length < 10) {
      const lastColor = firstFour[firstFour.length - 1];
      const paddingCount = 10 - firstFour.length;
      themeColors.brand = [...firstFour, ...Array(paddingCount).fill(lastColor)];
    } else {
      themeColors.brand = firstFour.slice(0, 10);
    }
  }

  const brandAccentKey = findBrandKey(colorsRecord, [
    'control-brand-accent-background',
    'control-brandAccentBackground',
    'brand-accent-background',
  ]);

  if (brandAccentKey && semanticColors[brandAccentKey]) {
    themeColors['brand-accent'] = semanticColors[brandAccentKey];
  }
}

/**
 * Create button variant color resolver
 */
function createButtonVariantResolver(
  semanticColors: Record<string, string[]>
): VariantColorsResolver {
  const getButtonColor = (key: string): string | undefined => {
    return semanticColors[key]?.[0];
  };

  return (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input);

    // Find matching button variant configuration
    const config = BUTTON_VARIANT_CONFIGS.find(
      (c) => c.color === input.color && c.variant === input.variant
    );

    if (!config) {
      return defaultResolvedColors;
    }

    const bgColor = getButtonColor(`${config.tokenPrefix}-background`);
    const textColor = getButtonColor(`${config.tokenPrefix}-text`);
    const hoverBg = getButtonColor(`${config.tokenPrefix}-hover-background`);
    const hoverText = getButtonColor(`${config.tokenPrefix}-hover-text`);

    const resolved = {
      ...defaultResolvedColors,
      ...(bgColor && { background: bgColor }),
      ...(textColor && { color: textColor }),
      ...(hoverBg && { hover: hoverBg }),
      ...(hoverText && { hoverColor: hoverText }),
    };

    // Add border for outlined variant (solid colors only - gradients handled via component styles)
    if (config.includeBorder) {
      const borderColor = getButtonColor(`${config.tokenPrefix}-border`);
      
      if (borderColor && !borderColor.includes('gradient')) {
        // Use standard border for solid colors only
        // Gradients are handled via Button component styles below
        resolved.border = `1px solid ${borderColor}`;
      }
    }

    return resolved;
  };
}

/**
 * Create a Mantine theme for a specific brand and color scheme
 */
export function createMantineTheme(
  brand: Brand,
  colorScheme: ColorScheme
): MantineThemeOverride {
  const brandColors = getBrandColors(brand, colorScheme);
  const colorsRecord = brandColors as Record<string, readonly string[]>;

  const { palettes, semanticColors } = processColors(colorsRecord, brand, colorScheme);

  const themeColors = {
    ...palettes,
    ...semanticColors,
  } as Record<string, string[]>;

  mapBrandColors(themeColors, semanticColors, colorsRecord, brand, colorScheme);

  const whiteColor = colorsRecord['base-white']?.[0] || '#ffffff';
  const blackColor = colorsRecord['base-black']?.[0] || '#000000';
  const spacing = getSpacing();
  const radius = getBorderRadius();

  return createTheme({
    defaultRadius: 'md',
    colors: themeColors as any,
    white: whiteColor,
    black: blackColor,
    spacing: spacing as any,
    radius: radius as any,
    variantColorResolver: createButtonVariantResolver(semanticColors),
    components: {
      Button: Button.extend({
        vars: (theme, props) => {
          const vars: Record<string, string> = {};

          // Set padding based on size
          if (props.size === 'small') {
            vars['--button-padding-x'] = theme.spacing['12'];
          } else if (props.size === 'medium') {
            vars['--button-padding-x'] = theme.spacing['16'];
          } else if (props.size === 'large') {
            vars['--button-padding-x'] = theme.spacing['24'];
          }

          // Styles that apply to all buttons
          vars['--button-radius'] = theme.radius['full'];

          return { root: vars };
        },
      }),
    },
  });
}


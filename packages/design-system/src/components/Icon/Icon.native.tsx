import React, { useCallback } from 'react';
import { SvgXml } from 'react-native-svg';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';

/**
 * Numeric pixel sizes for native icons.
 * Mirrors the web ICON_PIXEL_SIZES but uses numbers instead of CSS strings.
 */
export const NATIVE_ICON_PIXEL_SIZES = {
  'x-small': 14,
  small: 16,
  medium: 20,
  large: 24,
  'x-large': 32,
  'checkbox-default': 12,
  'checkbox-small': 10,
} as const;

export type NativeIconSize = keyof typeof NATIVE_ICON_PIXEL_SIZES;

/**
 * Maps semantic icon color names to NativeTheme token keys.
 * Consumers use short names: color="on-dark-secondary", color="brand-01".
 */
export const NATIVE_ICON_COLOR_MAP = {
  'brand-01': 'colorIconBrand01',
  'brand-02': 'colorIconBrand02',
  'brand-03': 'colorIconBrand03',
  'pull-quote-accent': 'semanticPullQuoteIconAccentColor',
  'on-dark-primary': 'colorIconOnDarkPrimary',
  'on-dark-secondary': 'colorIconOnDarkSecondary',
  'on-dark-tertiary': 'colorIconOnDarkTertiary',
  'on-light-primary': 'colorIconOnLightPrimary',
  'on-light-secondary': 'colorIconOnLightSecondary',
  'on-light-tertiary': 'colorIconOnLightTertiary',
  'state-attention-on-dark': 'colorIconStateAttentionOnDark',
  'state-attention-on-light': 'colorIconStateAttentionOnLight',
  'state-disabled-on-dark': 'colorIconStateDisabledOnDark',
  'state-disabled-on-light': 'colorIconStateDisabledOnLight',
} as const satisfies Readonly<Record<string, keyof NativeTheme>>;

export type NativeIconColor = keyof typeof NATIVE_ICON_COLOR_MAP;

/**
 * Props for native wrapped icon components.
 * Mirrors the web IconWrapperProps with native-appropriate types.
 */
export interface NativeIconWrapperProps {
  size?: NativeIconSize;
  color?: NativeIconColor;
  width?: number;
  height?: number;
  /** Test ID passed through to the underlying SVG element. */
  testID?: string;
}

/**
 * Creates a native icon component from raw SVG XML.
 * Uses react-native-svg's SvgXml to render the icon with design-system
 * size and semantic color tokens.
 *
 * Default size: medium. Default color: on-light-primary.
 *
 * Usage: `<SearchIcon size="small" color="on-dark-secondary" />`
 */
export function createNativeIconWrapper(
  svgXml: string,
  displayName?: string
): React.FC<NativeIconWrapperProps> {
  const NativeIcon: React.FC<NativeIconWrapperProps> = ({
    size = 'medium',
    color = 'on-light-primary',
    width,
    height,
    testID,
  }) => {
    const themeKey = NATIVE_ICON_COLOR_MAP[color];

    const resolvedColor = useNativeStyles(
      useCallback(
        (theme: NativeTheme) => {
          const value = theme[themeKey];
          return typeof value === 'string' ? value : '#000000';
        },
        [themeKey]
      )
    );

    const pixel = NATIVE_ICON_PIXEL_SIZES[size];
    const w = width ?? pixel;
    const h = height ?? pixel;

    // Replace CSS "currentcolor"/"currentColor" with the resolved theme color
    // since react-native-svg does not support the CSS currentColor keyword.
    const colorizedXml = svgXml.replace(/currentcolor/gi, resolvedColor);

    return <SvgXml xml={colorizedXml} width={w} height={h} testID={testID} />;
  };

  NativeIcon.displayName = displayName ?? 'NativeIcon';
  return NativeIcon;
}

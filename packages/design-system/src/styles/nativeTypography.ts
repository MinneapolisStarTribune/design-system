import { StyleSheet, type TextStyle } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';

type TypographyStyleMap = Record<string, TextStyle>;

/**
 * Apply the default semantic text color to every typography style entry.
 * This is the native equivalent of the web typography default color rule.
 */
function withDefaultTypographyColor<T extends TypographyStyleMap>(
  styles: T,
  theme: NativeTheme
): T {
  const defaultTextColor = theme.colorTextOnLightPrimary;

  return Object.fromEntries(
    Object.entries(styles).map(([key, style]) => [key, { color: defaultTextColor, ...style }])
  ) as T;
}

/**
 * Create a native StyleSheet with default typography color applied to all entries.
 */
export function createNativeTypographyStylesWithDefaults<T extends TypographyStyleMap>(
  theme: NativeTheme,
  styles: T
): T {
  return StyleSheet.create(withDefaultTypographyColor(styles, theme));
}

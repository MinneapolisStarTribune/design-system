import { useContext, useMemo } from 'react';
import { StyleSheet, type TextStyle } from 'react-native';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { createDesignSystemError } from '@/utils/errorPrefix';
import startribuneLightTheme from '@mobile/themes/startribune-light.js';
import startribuneDarkTheme from '@mobile/themes/startribune-dark.js';
import varsityLightTheme from '@mobile/themes/varsity-light.js';
import varsityDarkTheme from '@mobile/themes/varsity-dark.js';
import startribuneTypography from '@mobile/typography/startribune-typography.js';
import varsityTypography from '@mobile/typography/varsity-typography.js';

type BaseThemeTokens =
  | typeof startribuneLightTheme
  | typeof startribuneDarkTheme
  | typeof varsityLightTheme
  | typeof varsityDarkTheme;

type TypographyTokens = typeof startribuneTypography | typeof varsityTypography;
export type NativeTheme = BaseThemeTokens & TypographyTokens;
type NativeStyleMap = Record<string, TextStyle>;

/**
 * Memoises style creation against the current native theme tokens.
 */
export function useNativeStyles<T>(factory: (theme: NativeTheme) => T): T {
  const ctx = useContext(DesignSystemContext);

  if (!ctx) {
    throw new Error(
      createDesignSystemError('useNativeStyles', 'must be used within a DesignSystemProvider.')
    );
  }

  const { brand, colorScheme } = ctx;

  const theme = useMemo(() => {
    const baseTheme =
      brand === 'startribune'
        ? colorScheme === 'light'
          ? startribuneLightTheme
          : startribuneDarkTheme
        : colorScheme === 'light'
          ? varsityLightTheme
          : varsityDarkTheme;

    const typography: TypographyTokens =
      brand === 'startribune' ? startribuneTypography : varsityTypography;

    return {
      ...baseTheme,
      ...typography,
    } as NativeTheme;
  }, [brand, colorScheme]);

  return useMemo(() => factory(theme), [theme, factory]);
}

function withDefaultTypographyColor<T extends NativeStyleMap>(styles: T, theme: NativeTheme): T {
  const defaultTextColor = theme.colorTextOnLightPrimary;

  return Object.fromEntries(
    Object.entries(styles).map(([key, style]) => [key, { color: defaultTextColor, ...style }])
  ) as T;
}

export function useNativeStylesWithDefaults<T extends NativeStyleMap>(
  factory: (theme: NativeTheme) => T
): T {
  return useNativeStyles((theme) =>
    StyleSheet.create(withDefaultTypographyColor(factory(theme), theme))
  );
}

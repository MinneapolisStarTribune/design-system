import type { NativeTheme } from '@/hooks/useNativeStyles';

/**
 * Internal implementation for DS native components (e.g. `FormControl.TextInput`).
 * Maps {@link NativeTheme} semantic colors to field-style chrome; **not** a public surface for apps —
 * consumers should use `FormControl` / `useNativeStyles` with the theme, not import this module.
 *
 * Parallels web `TextInput.module.scss` state order: disabled → error → success → focus → filled → default.
 */
export type FieldSurfaceTokens = Pick<
  NativeTheme,
  | 'colorBackgroundDarkGray01'
  | 'colorBackgroundDarkGray02'
  | 'colorBackgroundLightDefault'
  | 'colorBackgroundLightGray01'
  | 'colorBorderOnDarkStrong01'
  | 'colorBorderOnDarkSubtle01'
  | 'colorBorderOnLightStrong01'
  | 'colorBorderOnLightSubtle02'
  | 'colorBorderStateAttentionOnDark'
  | 'colorBorderStateAttentionOnLight'
  | 'colorBorderStateDisabledOnDark'
  | 'colorBorderStateDisabledOnLight'
  | 'colorBorderStateFocus'
  | 'colorBorderStateSuccessOnDark'
  | 'colorBorderStateSuccessOnLight'
  | 'colorTextOnDarkPrimary'
  | 'colorTextOnLightPrimary'
  | 'colorTextStateDisabledOnDark'
  | 'colorTextStateDisabledOnLight'
>;

/** Default border width for field chrome (matches web `1px` TextInput outline). */
export const fieldSurfaceBorderWidth = 1;

export interface FieldSurfaceState {
  isDark: boolean;
  isDisabled: boolean;
  hasError: boolean;
  hasSuccess: boolean;
  focused: boolean;
  isFilled: boolean;
}

export interface FieldSurfaceColors {
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  /** Placeholder on `TextInput`; maps to subdued text when wiring custom controls internally. */
  placeholderTextColor: string;
}

/** @internal */
export function getFieldSurfaceTokens(theme: NativeTheme): FieldSurfaceTokens {
  return {
    colorBackgroundDarkGray01: theme.colorBackgroundDarkGray01,
    colorBackgroundDarkGray02: theme.colorBackgroundDarkGray02,
    colorBackgroundLightDefault: theme.colorBackgroundLightDefault,
    colorBackgroundLightGray01: theme.colorBackgroundLightGray01,
    colorBorderOnDarkStrong01: theme.colorBorderOnDarkStrong01,
    colorBorderOnDarkSubtle01: theme.colorBorderOnDarkSubtle01,
    colorBorderOnLightStrong01: theme.colorBorderOnLightStrong01,
    colorBorderOnLightSubtle02: theme.colorBorderOnLightSubtle02,
    colorBorderStateAttentionOnDark: theme.colorBorderStateAttentionOnDark,
    colorBorderStateAttentionOnLight: theme.colorBorderStateAttentionOnLight,
    colorBorderStateDisabledOnDark: theme.colorBorderStateDisabledOnDark,
    colorBorderStateDisabledOnLight: theme.colorBorderStateDisabledOnLight,
    colorBorderStateFocus: theme.colorBorderStateFocus,
    colorBorderStateSuccessOnDark: theme.colorBorderStateSuccessOnDark,
    colorBorderStateSuccessOnLight: theme.colorBorderStateSuccessOnLight,
    colorTextOnDarkPrimary: theme.colorTextOnDarkPrimary,
    colorTextOnLightPrimary: theme.colorTextOnLightPrimary,
    colorTextStateDisabledOnDark: theme.colorTextStateDisabledOnDark,
    colorTextStateDisabledOnLight: theme.colorTextStateDisabledOnLight,
  };
}

/** @internal */
export function getFieldSurfaceColors(
  tokens: FieldSurfaceTokens,
  { isDark, isDisabled, hasError, hasSuccess, focused, isFilled }: FieldSurfaceState
): FieldSurfaceColors {
  if (isDisabled) {
    return {
      borderColor: isDark
        ? tokens.colorBorderStateDisabledOnDark
        : tokens.colorBorderStateDisabledOnLight,
      backgroundColor: isDark
        ? tokens.colorBackgroundDarkGray02
        : tokens.colorBackgroundLightGray01,
      textColor: isDark
        ? tokens.colorTextStateDisabledOnDark
        : tokens.colorTextStateDisabledOnLight,
      placeholderTextColor: isDark
        ? tokens.colorTextStateDisabledOnDark
        : tokens.colorTextStateDisabledOnLight,
    };
  }
  if (hasError) {
    return {
      borderColor: isDark
        ? tokens.colorBorderStateAttentionOnDark
        : tokens.colorBorderStateAttentionOnLight,
      backgroundColor: isDark
        ? tokens.colorBackgroundDarkGray01
        : tokens.colorBackgroundLightDefault,
      textColor: isDark ? tokens.colorTextOnDarkPrimary : tokens.colorTextOnLightPrimary,
      placeholderTextColor: isDark
        ? tokens.colorTextStateDisabledOnDark
        : tokens.colorTextStateDisabledOnLight,
    };
  }
  if (hasSuccess) {
    return {
      borderColor: isDark
        ? tokens.colorBorderStateSuccessOnDark
        : tokens.colorBorderStateSuccessOnLight,
      backgroundColor: isDark
        ? tokens.colorBackgroundDarkGray01
        : tokens.colorBackgroundLightDefault,
      textColor: isDark ? tokens.colorTextOnDarkPrimary : tokens.colorTextOnLightPrimary,
      placeholderTextColor: isDark
        ? tokens.colorTextStateDisabledOnDark
        : tokens.colorTextStateDisabledOnLight,
    };
  }
  if (focused) {
    return {
      borderColor: tokens.colorBorderStateFocus,
      backgroundColor: isDark
        ? tokens.colorBackgroundDarkGray01
        : tokens.colorBackgroundLightDefault,
      textColor: isDark ? tokens.colorTextOnDarkPrimary : tokens.colorTextOnLightPrimary,
      placeholderTextColor: isDark
        ? tokens.colorTextStateDisabledOnDark
        : tokens.colorTextStateDisabledOnLight,
    };
  }
  if (isFilled) {
    return {
      borderColor: isDark ? tokens.colorBorderOnDarkStrong01 : tokens.colorBorderOnLightStrong01,
      backgroundColor: isDark
        ? tokens.colorBackgroundDarkGray01
        : tokens.colorBackgroundLightDefault,
      textColor: isDark ? tokens.colorTextOnDarkPrimary : tokens.colorTextOnLightPrimary,
      placeholderTextColor: isDark
        ? tokens.colorTextStateDisabledOnDark
        : tokens.colorTextStateDisabledOnLight,
    };
  }
  return {
    borderColor: isDark ? tokens.colorBorderOnDarkSubtle01 : tokens.colorBorderOnLightSubtle02,
    backgroundColor: isDark ? tokens.colorBackgroundDarkGray01 : tokens.colorBackgroundLightDefault,
    textColor: isDark ? tokens.colorTextOnDarkPrimary : tokens.colorTextOnLightPrimary,
    placeholderTextColor: isDark
      ? tokens.colorTextStateDisabledOnDark
      : tokens.colorTextStateDisabledOnLight,
  };
}

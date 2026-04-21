import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';
import type { CheckboxVariant } from '../Checkbox.types.native';

export type CheckboxVisualParams = {
  variant: CheckboxVariant;
  checked: boolean;
  indeterminate: boolean;
  error: boolean;
  disabled: boolean;
};

export type CheckboxBoxColors = {
  borderColor: string;
  backgroundColor: string;
  showIcon: boolean;
  iconColor: string;
};

/**
 * Resolve border, fill, and glyph colors for the checkbox box (unchecked, checked, indeterminate, error).
 */
export function getCheckboxBoxColors(
  theme: NativeTheme,
  variant: CheckboxVariant,
  checked: boolean,
  indeterminate: boolean,
  error: boolean
): CheckboxBoxColors {
  const isOn = checked || indeterminate;

  if (!isOn) {
    return {
      borderColor: error
        ? theme.colorBorderStateAttentionOnLight
        : theme.colorCheckboxBorderUnchecked,
      backgroundColor: 'transparent',
      showIcon: false,
      iconColor: theme.colorCheckboxIconUnchecked,
    };
  }

  const borderSelected =
    variant === 'brand'
      ? theme.colorCheckboxBorderSelectedBrand
      : theme.colorCheckboxBorderSelectedNeutral;
  const bgNeutral = theme.colorCheckboxBackgroundSelectedNeutral;
  const bgBrand = theme.colorCheckboxBackgroundSelectedBrand;
  const iconNeutral = theme.colorCheckboxIconSelectedNeutral;
  const iconBrand = theme.colorCheckboxIconSelectedBrand;

  if (error) {
    return {
      borderColor: theme.colorBorderStateAttentionOnLight,
      backgroundColor: variant === 'neutral' ? bgNeutral : bgBrand,
      showIcon: true,
      iconColor: variant === 'neutral' ? iconNeutral : iconBrand,
    };
  }

  return {
    borderColor: borderSelected,
    backgroundColor: variant === 'brand' ? bgBrand : bgNeutral,
    showIcon: true,
    iconColor: variant === 'brand' ? iconBrand : iconNeutral,
  };
}

export type CheckboxNativeStyles = {
  root: ViewStyle;
  pressable: ViewStyle;
  visualBox: ViewStyle;
  glyph: TextStyle;
  textColumn: ViewStyle;
  descriptionText: TextStyle;
};

export type CheckboxStylesResult = {
  styles: CheckboxNativeStyles;
  showIcon: boolean;
};

/**
 * Theme-bound styles for native Checkbox. Call inside `useNativeStyles` with a stable factory (`useCallback`).
 */
export function createCheckboxStyles(
  theme: NativeTheme,
  { variant, checked, indeterminate, error, disabled }: CheckboxVisualParams
): CheckboxStylesResult {
  const box = getCheckboxBoxColors(theme, variant, checked, indeterminate, error);
  const size = theme.spacingCheckboxDefault;
  const glyphSize = Math.round(size * 0.58);
  const lineHeight = Math.round(size * 0.68);

  const styles = StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing8,
      opacity: disabled ? 0.4 : 1,
    },
    pressable: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing8,
      flexShrink: 1,
    },
    visualBox: {
      width: size,
      height: size,
      borderRadius: theme.radius4,
      borderWidth: 1,
      borderColor: box.borderColor,
      backgroundColor: box.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    glyph: {
      color: box.iconColor,
      fontSize: glyphSize,
      fontWeight: '700',
      lineHeight,
      marginTop: indeterminate ? -1 : 0,
    },
    textColumn: {
      flexShrink: 1,
      gap: theme.spacing4,
    },
    descriptionText: {
      color: theme.colorTextOnLightTertiary,
    },
  });

  return {
    styles,
    showIcon: box.showIcon,
  };
}

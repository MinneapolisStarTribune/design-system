import type { NativeTheme } from '@/hooks/useNativeStyles';
import type { ButtonColor, ButtonVariant } from '../Button.types';

export type ButtonSurfaceColors = {
  backgroundColor: string;
  color: string;
  borderColor?: string;
  borderWidth?: number;
};

/**
 * Maps web-equivalent hover tokens to pressed state on native.
 */
export function getNativeButtonSurface(
  theme: NativeTheme,
  color: ButtonColor,
  variant: ButtonVariant,
  pressed: boolean
): ButtonSurfaceColors {
  const p = pressed;

  if (color === 'neutral') {
    if (variant === 'filled') {
      return {
        backgroundColor: p
          ? theme.colorButtonNeutralFilledHoverBackground
          : theme.colorButtonNeutralFilledBackground,
        color: p ? theme.colorButtonNeutralFilledHoverText : theme.colorButtonNeutralFilledText,
      };
    }
    if (variant === 'outlined') {
      return {
        backgroundColor: p
          ? theme.colorButtonNeutralOutlinedHoverBackground
          : theme.colorButtonNeutralOutlinedBackground,
        color: p ? theme.colorButtonNeutralOutlinedHoverText : theme.colorButtonNeutralOutlinedText,
        borderColor: p
          ? theme.colorButtonNeutralOutlinedHoverBorder
          : theme.colorButtonNeutralOutlinedBorder,
        borderWidth: 1,
      };
    }
    return {
      backgroundColor: p
        ? theme.colorButtonNeutralGhostHoverBackground
        : theme.colorButtonNeutralGhostBackground,
      color: p ? theme.colorButtonNeutralGhostHoverText : theme.colorButtonNeutralGhostText,
    };
  }

  if (color === 'brand') {
    if (variant === 'filled') {
      return {
        backgroundColor: p
          ? theme.colorButtonBrandFilledHoverBackground
          : theme.colorButtonBrandFilledBackground,
        color: p ? theme.colorButtonBrandFilledHoverText : theme.colorButtonBrandFilledText,
      };
    }
    if (variant === 'outlined') {
      return {
        backgroundColor: p
          ? theme.colorButtonBrandOutlinedHoverBackground
          : theme.colorButtonBrandOutlinedBackground,
        color: p ? theme.colorButtonBrandOutlinedHoverText : theme.colorButtonBrandOutlinedText,
        borderColor: theme.colorButtonBrandOutlinedBorder,
        borderWidth: 1,
      };
    }
    return {
      backgroundColor: p
        ? theme.colorButtonBrandGhostHoverBackground
        : theme.colorButtonBrandGhostBackground,
      color: p ? theme.colorButtonBrandGhostHoverText : theme.colorButtonBrandGhostText,
    };
  }

  /* brand-accent */
  if (variant === 'filled') {
    return {
      backgroundColor: p
        ? theme.colorButtonBrandAccentFilledHoverBackground
        : theme.colorButtonBrandAccentFilledBackground,
      color: p
        ? theme.colorButtonBrandAccentFilledHoverText
        : theme.colorButtonBrandAccentFilledText,
    };
  }
  if (variant === 'outlined') {
    return {
      backgroundColor: p
        ? theme.colorButtonBrandAccentOutlinedHoverBackground
        : theme.colorButtonBrandAccentOutlinedBackground,
      color: p
        ? theme.colorButtonBrandAccentOutlinedHoverText
        : theme.colorButtonBrandAccentOutlinedText,
      borderColor: theme.colorButtonBrandAccentOutlinedBorder,
      borderWidth: 1,
    };
  }
  return {
    backgroundColor: p
      ? theme.colorButtonBrandAccentGhostHoverBackground
      : theme.colorButtonBrandAccentGhostBackground,
    color: p ? theme.colorButtonBrandAccentGhostHoverText : theme.colorButtonBrandAccentGhostText,
  };
}

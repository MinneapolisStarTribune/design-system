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
  if (color === 'neutral') {
    if (variant === 'filled') {
      return {
        backgroundColor: pressed
          ? theme.colorButtonNeutralFilledHoverBackground
          : theme.colorButtonNeutralFilledBackground,
        color: pressed
          ? theme.colorButtonNeutralFilledHoverText
          : theme.colorButtonNeutralFilledText,
      };
    }
    if (variant === 'outlined') {
      return {
        backgroundColor: pressed
          ? theme.colorButtonNeutralOutlinedHoverBackground
          : theme.colorButtonNeutralOutlinedBackground,
        color: pressed
          ? theme.colorButtonNeutralOutlinedHoverText
          : theme.colorButtonNeutralOutlinedText,
        borderColor: pressed
          ? theme.colorButtonNeutralOutlinedHoverBorder
          : theme.colorButtonNeutralOutlinedBorder,
        borderWidth: 1,
      };
    }
    return {
      backgroundColor: pressed
        ? theme.colorButtonNeutralGhostHoverBackground
        : theme.colorButtonNeutralGhostBackground,
      color: pressed ? theme.colorButtonNeutralGhostHoverText : theme.colorButtonNeutralGhostText,
    };
  }

  if (color === 'brand') {
    if (variant === 'filled') {
      return {
        backgroundColor: pressed
          ? theme.colorButtonBrandFilledHoverBackground
          : theme.colorButtonBrandFilledBackground,
        color: pressed ? theme.colorButtonBrandFilledHoverText : theme.colorButtonBrandFilledText,
      };
    }
    if (variant === 'outlined') {
      return {
        backgroundColor: pressed
          ? theme.colorButtonBrandOutlinedHoverBackground
          : theme.colorButtonBrandOutlinedBackground,
        color: pressed
          ? theme.colorButtonBrandOutlinedHoverText
          : theme.colorButtonBrandOutlinedText,
        borderColor: theme.colorButtonBrandOutlinedBorder,
        borderWidth: 1,
      };
    }
    return {
      backgroundColor: pressed
        ? theme.colorButtonBrandGhostHoverBackground
        : theme.colorButtonBrandGhostBackground,
      color: pressed ? theme.colorButtonBrandGhostHoverText : theme.colorButtonBrandGhostText,
    };
  }

  /* brand-accent */
  if (variant === 'filled') {
    return {
      backgroundColor: pressed
        ? theme.colorButtonBrandAccentFilledHoverBackground
        : theme.colorButtonBrandAccentFilledBackground,
      color: pressed
        ? theme.colorButtonBrandAccentFilledHoverText
        : theme.colorButtonBrandAccentFilledText,
    };
  }
  if (variant === 'outlined') {
    return {
      backgroundColor: pressed
        ? theme.colorButtonBrandAccentOutlinedHoverBackground
        : theme.colorButtonBrandAccentOutlinedBackground,
      color: pressed
        ? theme.colorButtonBrandAccentOutlinedHoverText
        : theme.colorButtonBrandAccentOutlinedText,
      borderColor: theme.colorButtonBrandAccentOutlinedBorder,
      borderWidth: 1,
    };
  }
  return {
    backgroundColor: pressed
      ? theme.colorButtonBrandAccentGhostHoverBackground
      : theme.colorButtonBrandAccentGhostBackground,
    color: pressed
      ? theme.colorButtonBrandAccentGhostHoverText
      : theme.colorButtonBrandAccentGhostText,
  };
}

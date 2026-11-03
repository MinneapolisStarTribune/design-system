import type { NativeTheme } from '@/hooks/useNativeStyles';
import type { ButtonColor, ButtonVariant } from '../Button.types';

export type ButtonSurface = 'light' | 'dark';

export type ButtonSurfaceColors = {
  backgroundColor: string;
  color: string;
  borderColor?: string;
  borderWidth?: number;
};

function getDarkNeutralButtonSurface(
  theme: NativeTheme,
  variant: ButtonVariant,
  pressed: boolean
): ButtonSurfaceColors {
  if (variant === 'filled') {
    return {
      backgroundColor: pressed ? theme.colorNeutral200 : theme.colorBaseWhite,
      color: theme.colorNeutral950,
    };
  }

  if (variant === 'outlined') {
    return {
      backgroundColor: pressed ? theme.colorNeutral800 : 'transparent',
      color: theme.colorBaseWhite,
      borderColor: theme.colorBaseWhite,
      borderWidth: 1,
    };
  }

  return {
    backgroundColor: pressed ? theme.colorNeutral800 : 'transparent',
    color: theme.colorBaseWhite,
  };
}

/*
 * Pressed colors for error buttons, precomputed from web's `color-mix()` (no equivalent in RN):
 * filled = 85% foreground over background, outlined/ghost = 12% foreground tint.
 */
const ERROR_PRESSED = {
  light: { filled: '#bd3b3b', tint: 'rgb(177 27 27 / 12%)' },
  dark: { filled: '#e6adad', tint: 'rgb(254 202 202 / 12%)' },
};

/**
 * Error colors - for destructive actions (e.g. Delete). Mirrors web: no button-error-* tokens yet, so
 * these build on the semantic error pair; filled inverts it so contrast holds in light and dark.
 * Dark surface uses the dark-theme values of that pair (web `.surfaceDark`).
 */
function getErrorButtonSurface(
  theme: NativeTheme,
  variant: ButtonVariant,
  pressed: boolean,
  surface: ButtonSurface
): ButtonSurfaceColors {
  /* Dark app theme's semantic pair is red-200 / red-950, same as the dark-surface override */
  const isDark = surface === 'dark' || theme.colorSemanticErrorForeground === theme.colorRed200;
  const foreground = isDark ? theme.colorRed200 : theme.colorSemanticErrorForeground;
  const background = isDark ? theme.colorRed950 : theme.colorSemanticErrorBackground;
  const pressedColors = ERROR_PRESSED[isDark ? 'dark' : 'light'];
  const pressedTint = pressedColors.tint;

  if (variant === 'filled') {
    return {
      backgroundColor: pressed ? pressedColors.filled : foreground,
      color: background,
    };
  }

  if (variant === 'outlined') {
    return {
      backgroundColor: pressed ? pressedTint : 'transparent',
      color: foreground,
      borderColor: foreground,
      borderWidth: 1,
    };
  }

  return {
    backgroundColor: pressed ? pressedTint : 'transparent',
    color: foreground,
  };
}

/**
 * Maps web-equivalent hover tokens to pressed state on native.
 */
export function getNativeButtonSurface(
  theme: NativeTheme,
  color: ButtonColor,
  variant: ButtonVariant,
  pressed: boolean,
  surface: ButtonSurface = 'light'
): ButtonSurfaceColors {
  if (surface === 'dark' && color === 'neutral') {
    return getDarkNeutralButtonSurface(theme, variant, pressed);
  }

  if (color === 'error') {
    return getErrorButtonSurface(theme, variant, pressed, surface);
  }

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

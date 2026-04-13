import type { MouseEventHandler, ReactElement, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { BaseProps } from '@/types/globalTypes';

export const BUTTON_COLORS = ['neutral', 'brand', 'brand-accent'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['filled', 'outlined', 'ghost'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export const ICON_ONLY_BUTTON_SIZES = ['x-small', 'small', 'medium', 'large'] as const;
export type IconOnlyButtonSize = (typeof ICON_ONLY_BUTTON_SIZES)[number];

/** Extra data to merge into the tracking event (web analytics). */
export type ButtonAnalytics = Record<string, unknown>;

export interface ButtonProps extends BaseProps {
  type?: 'button' | 'submit' | 'reset';
  color?: ButtonColor;
  capitalize?: boolean;
  variant?: ButtonVariant;
  /**
   * Button size. Note: 'x-small' is only valid for icon-only buttons (buttons with icon but no text children).
   */
  size?: ButtonSize | 'x-small';
  /**
   * Optional icon. For icon-only buttons, pass the icon.
   * For buttons with text, use iconPosition to place it before or after the label.
   * Web: SVG; React Native: typically react-native-svg output.
   */
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
  children?: ReactNode;
  isDisabled?: boolean;
  analytics?: ButtonAnalytics;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/** React Native Button — uses Pressable; no DOM / HTML. */
export interface ButtonNativeProps {
  color?: ButtonColor;
  capitalize?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize | 'x-small';
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
  children?: ReactNode;
  isDisabled?: boolean;
  /** Shows a spinner and disables presses while true. */
  isLoading?: boolean;
  onPress?: () => void;
  /** Merged with computed layout styles. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

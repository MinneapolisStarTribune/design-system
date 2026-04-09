import type React from 'react';

/**
 * Base shared props across components
 */
export interface BaseProps {
  className?: string | string[];
  style?: React.CSSProperties;
  dataTestId?: string; // this will likely have defaults set at the component level
}

/**
 * Accessibility props shared across components
 */
export type AccessibilityProps = {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
};

/**
 * Global size tokens for the design system
 */
export const SIZES = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large'] as const;

export type Size = (typeof SIZES)[number];

/**
 * Global font weight/style tokens for the design system
 */
export const FONT_WEIGHT_STYLE = [
  'regular',
  'medium',
  'italic',
  'semibold',
  'semibold-italic',
  'bold',
  'bold-italic',
  'dropcap',
] as const;

export type FontWeight = (typeof FONT_WEIGHT_STYLE)[number];

/**
 * UtilityLabel size tokens for the design system
 */
export type UtilityLabelSize = Extract<Size, 'small' | 'medium' | 'large'>;

/**
 * UtilityLabel weight tokens for the design system
 */
export type UtilityLabelWeight = Extract<FontWeight, 'regular' | 'semibold' | 'bold'>;

/**
 * Global position tokens for overlays and floating UI
 */
export const POSITIONS = ['top', 'right', 'bottom', 'left'] as const;

export type Position = (typeof POSITIONS)[number];

/**
 * Semantic text color tokens. Values map to CSS variables.
 * Consumers use short names: color="on-dark-secondary", color="brand-01".
 */
export const TEXT_COLOR_TOKENS = {
  'brand-01': 'var(--color-text-brand-01)',
  'brand-02': 'var(--color-text-brand-02)',
  'brand-03': 'var(--color-text-brand-03)',
  'on-dark-primary': 'var(--color-text-on-dark-primary)',
  'on-dark-secondary': 'var(--color-text-on-dark-secondary)',
  'on-dark-tertiary': 'var(--color-text-on-dark-tertiary)',
  'on-light-primary': 'var(--color-text-on-light-primary)',
  'on-light-secondary': 'var(--color-text-on-light-secondary)',
  'on-light-tertiary': 'var(--color-text-on-light-tertiary)',
  'state-attention-on-dark': 'var(--color-text-state-attention-on-dark)',
  'state-attention-on-light': 'var(--color-text-state-attention-on-light)',
  'state-disabled-on-dark': 'var(--color-text-state-disabled-on-dark)',
  'state-disabled-on-light': 'var(--color-text-state-disabled-on-light)',
  'state-success-on-dark': 'var(--color-text-state-success-on-dark)',
  'state-success-on-light': 'var(--color-text-state-success-on-light)',
} as const;

export type TextColor = keyof typeof TEXT_COLOR_TOKENS;

/**
 * Shared variant props across components
 */
export type VariantProps<Color extends string, Variant extends string> = {
  color?: Color;
  variant?: Variant;
  size?: Size;
  isDisabled?: boolean;
};

/**
 * Typography variant props
 */
export type ColorVariantProps = VariantProps<TextColor, string>;

/**
 * Resolve semantic text color to inline style
 */
export const resolveTextColorStyle = (
  color?: TextColor,
  style?: React.CSSProperties
): React.CSSProperties => {
  if (!color) return style || {};
  return {
    color: `${TEXT_COLOR_TOKENS[color]} !important`,
    ...style,
  };
};

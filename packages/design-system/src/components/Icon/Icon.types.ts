import type { SVGProps } from 'react';

export const ICON_PIXEL_SIZES = {
  'x-small': '14px',
  small: '16px',
  medium: '20px',
  large: '24px',
  'x-large': '32px',
} as const;

export type IconSize = keyof typeof ICON_PIXEL_SIZES;

/**
 * Semantic icon color tokens. Values map to CSS variables (e.g. var(--color-icon-on-dark-secondary)).
 * Consumers use short names: color="on-dark-secondary", color="brand-01".
 */
export const ICON_COLOR_TOKENS = {
  'brand-01': 'var(--color-icon-brand-01)',
  'brand-02': 'var(--color-icon-brand-02)',
  'brand-03': 'var(--color-icon-brand-03)',
  'on-dark-primary': 'var(--color-icon-on-dark-primary)',
  'on-dark-secondary': 'var(--color-icon-on-dark-secondary)',
  'on-dark-tertiary': 'var(--color-icon-on-dark-tertiary)',
  'on-light-primary': 'var(--color-icon-on-light-primary)',
  'on-light-secondary': 'var(--color-icon-on-light-secondary)',
  'on-light-tertiary': 'var(--color-icon-on-light-tertiary)',
  'state-attention-on-dark': 'var(--color-icon-state-attention-on-dark)',
  'state-attention-on-light': 'var(--color-icon-state-attention-on-light)',
  'state-disabled-on-dark': 'var(--color-icon-state-disabled-on-dark)',
  'state-disabled-on-light': 'var(--color-icon-state-disabled-on-light)',
  'state-success-on-dark': 'var(--color-icon-state-success-on-dark)',
  'state-success-on-light': 'var(--color-icon-state-success-on-light)',
} as const;

export type IconColor = keyof typeof ICON_COLOR_TOKENS;

/**
 * Props for wrapped icon components exported from the design system.
 * Consumers choose from predetermined size and color tokens.
 */
export type IconWrapperProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> & {
  size?: IconSize;
  color?: IconColor;
};

export type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

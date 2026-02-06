export interface BaseProps {
  className?: string | string[];
  dataTestId?: string; // this will likely have defaults set at the component level
}

export type VariantProps<Color extends string, Variant extends string> = {
  color?: Color;
  variant?: Variant;
  size?: Size;
  isDisabled?: boolean;
};

export type AccessibilityProps = {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
};

// Icon color tokens from the design system - single source of truth
export const ICON_COLORS = [
  'on-light-primary',
  'on-light-secondary',
  'on-light-tertiary',
  'on-dark-primary',
  'on-dark-secondary',
  'on-dark-tertiary',
  'state-attention-on-light',
  'state-attention-on-dark',
  'state-disabled-on-light',
  'state-disabled-on-dark',
  'brand-01',
  'brand-02',
  'brand-03',
  'brand-button-icon',
  'brand-accent-button-icon',
  'neutral-filled-button-icon',
  'neutral-outlined-button-icon',
  'neutral-ghost-button-icon',
  'neutral-utility-button-icon',
] as const;

export type IconColor = (typeof ICON_COLORS)[number];

export type IconSpecificProps<IconName extends string = string> = {
  name: IconName;
  color?: IconColor;
  size?: Extract<Size, 'small' | 'medium' | 'large'>;
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
 * Global position tokens for overlays and floating UI
 */
export const POSITIONS = ['top', 'right', 'bottom', 'left'] as const;

export type Position = (typeof POSITIONS)[number];

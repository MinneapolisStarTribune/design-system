export interface BaseProps {
  className?: string | string[];
  style?: React.CSSProperties;
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

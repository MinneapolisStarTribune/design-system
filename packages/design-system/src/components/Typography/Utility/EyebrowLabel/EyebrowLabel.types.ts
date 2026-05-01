import type { AccessibilityProps, BaseProps } from '@/types/globalTypes';
import type { Brand } from '@/providers/theme-helpers';
import type { IconColor } from '@/components/Icon/Icon.types';

export const EYEBROW_LABEL_SIZES = ['small', 'medium', 'large'] as const;
export type EyebrowLabelSize = (typeof EYEBROW_LABEL_SIZES)[number];

export const EYEBROW_LABEL_COLORS = ['neutral', 'brand', 'live'] as const;
export type EyebrowLabelColor = (typeof EYEBROW_LABEL_COLORS)[number];

export const EYEBROW_LABEL_BACKGROUNDS = ['on-light', 'on-dark'] as const;
export type EyebrowLabelBackground = (typeof EYEBROW_LABEL_BACKGROUNDS)[number];

export const EYEBROW_LABEL_AS_ELEMENTS = ['span', 'label'] as const;
export type EyebrowLabelAsElement = (typeof EYEBROW_LABEL_AS_ELEMENTS)[number];

export interface EyebrowLabelProps extends BaseProps, AccessibilityProps {
  children?: React.ReactNode;
  label?: string;
  size?: EyebrowLabelSize;
  color?: EyebrowLabelColor;
  /**
   * Show the product brand mark to the left of the label when not `live`.
   * Ignored when `color` is `live` (only the live dot + text are shown).
   * @default false
   */
  logo?: boolean;
  /** Icon color when `logo` is shown. Omit to match eyebrow text (`currentColor`). */
  logoColor?: IconColor;
  /**
   * Legacy API: true maps to "on-dark", false maps to "on-light".
   * @default false
   */
  isBackground?: boolean;
  /** Preferred API for choosing contrast context. */
  background?: EyebrowLabelBackground;
  /** Uses provider brand when not supplied. */
  brand?: Brand;
  as?: EyebrowLabelAsElement;
  htmlFor?: string;
  id?: string;
}

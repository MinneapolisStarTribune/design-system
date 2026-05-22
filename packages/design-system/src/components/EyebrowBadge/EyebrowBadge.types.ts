import type { AccessibilityProps, BaseProps } from '@/types';

export const EYEBROW_BADGE_VARIANTS = ['live', 'breaking', 'showcase', 'sponsored'] as const;
export type EyebrowBadgeVariant = (typeof EYEBROW_BADGE_VARIANTS)[number];

export const EYEBROW_BADGE_AS_ELEMENTS = ['span', 'div'] as const;
export type EyebrowBadgeAsElement = (typeof EYEBROW_BADGE_AS_ELEMENTS)[number];

export const EYEBROW_BADGE_SIZES = ['large', 'small'] as const;
export type EyebrowBadgeSize = (typeof EYEBROW_BADGE_SIZES)[number];

export interface EyebrowBadgeProps extends BaseProps, AccessibilityProps {
  label: string;
  secondaryLabel?: string;
  variant?: EyebrowBadgeVariant;
  /** Badge height / radius tokens. Defaults to `large` (24px tall, 6px radius where applicable). */
  size?: EyebrowBadgeSize;
  showDot?: boolean;
  as?: EyebrowBadgeAsElement;
}

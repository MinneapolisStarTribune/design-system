import type { AccessibilityProps, BaseProps } from '@/types';

export const EYEBROW_BADGE_VARIANTS = ['live', 'breaking', 'showcase', 'sponsored'] as const;
export type EyebrowBadgeVariant = (typeof EYEBROW_BADGE_VARIANTS)[number];

export const EYEBROW_BADGE_AS_ELEMENTS = ['span', 'div'] as const;
export type EyebrowBadgeAsElement = (typeof EYEBROW_BADGE_AS_ELEMENTS)[number];

export interface EyebrowBadgeProps extends BaseProps, AccessibilityProps {
  label: string;
  secondaryLabel?: string;
  variant?: EyebrowBadgeVariant;
  showDot?: boolean;
  as?: EyebrowBadgeAsElement;
}

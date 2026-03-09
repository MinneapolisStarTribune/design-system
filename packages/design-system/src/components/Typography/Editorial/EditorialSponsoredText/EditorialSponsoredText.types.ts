import type { AccessibilityProps, BaseProps, FontWeight, Size } from '@/types/globalTypes';

export type EditorialSponsoredTextWeight = Extract<FontWeight, 'regular' | 'bold'>;

export const EDITORIAL_SPONSORED_TEXT_WEIGHTS = [
  'regular',
  'bold',
] as const satisfies readonly EditorialSponsoredTextWeight[];

export const EDITORIAL_SPONSORED_TEXT_SIZES = [
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
] as const satisfies readonly Size[];

export type EditorialSponsoredTextSize = (typeof EDITORIAL_SPONSORED_TEXT_SIZES)[number];

export interface EditorialSponsoredTextProps extends BaseProps, AccessibilityProps {
  size: EditorialSponsoredTextSize;
  weight?: EditorialSponsoredTextWeight;
  children: React.ReactNode;
}

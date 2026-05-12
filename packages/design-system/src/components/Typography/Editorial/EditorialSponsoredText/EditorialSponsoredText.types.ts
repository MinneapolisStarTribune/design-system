import type {
  AccessibilityProps,
  BaseProps,
  FontWeight,
  Size,
  ColorVariantProps,
} from '@/types/globalTypes';
import type { NativeTextStylingProps } from '@/types/native-base-props';

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

export interface EditorialSponsoredTextProps
  extends BaseProps,
    AccessibilityProps,
    ColorVariantProps {
  size: EditorialSponsoredTextSize;
  weight?: EditorialSponsoredTextWeight;
  children: React.ReactNode;
}

export type EditorialSponsoredTextNativeProps = NativeTextStylingProps<EditorialSponsoredTextProps>;

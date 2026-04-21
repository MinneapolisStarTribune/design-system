import type { AccessibilityProps, BaseProps, ColorVariantProps } from '@/types/globalTypes';
import type { NativeTextStylingProps } from '@/types/nativeBaseProps';

export const UTILITY_BODY_SIZES = [
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
] as const;
export const UTILITY_BODY_WEIGHTS = ['regular', 'italic', 'medium', 'semibold', 'bold'] as const;

export type UtilityBodySize = (typeof UTILITY_BODY_SIZES)[number];
export type UtilityBodyWeight = (typeof UTILITY_BODY_WEIGHTS)[number];

export interface UtilityBodyProps extends BaseProps, AccessibilityProps, ColorVariantProps {
  size?: UtilityBodySize;
  weight?: UtilityBodyWeight;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export type UtilityBodyNativeProps = NativeTextStylingProps<UtilityBodyProps>;

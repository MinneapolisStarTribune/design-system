import type { AccessibilityProps, BaseProps, ColorVariantProps } from '@/types/globalTypes';
import type { NativeTextStylingProps } from '@/types/native-base-props';

export const UTILITY_LABEL_SIZES = ['small', 'medium', 'large'] as const;
export const UTILITY_LABEL_WEIGHTS = ['regular', 'semibold'] as const;

export type UtilityLabelSize = (typeof UTILITY_LABEL_SIZES)[number];
export type UtilityLabelWeight = (typeof UTILITY_LABEL_WEIGHTS)[number];

export const UTILITY_LABEL_AS_ELEMENTS = ['span', 'label'] as const;
export type UtilityLabelAsElement = (typeof UTILITY_LABEL_AS_ELEMENTS)[number];

export interface UtilityLabelProps extends BaseProps, AccessibilityProps, ColorVariantProps {
  size: UtilityLabelSize;
  weight?: UtilityLabelWeight;
  capitalize?: boolean;
  id?: string;
  children: React.ReactNode;
  htmlFor?: string;
  as?: UtilityLabelAsElement;
}

/** React Native — no `className`, `htmlFor`, or `as`. */
export type UtilityLabelNativeProps = Omit<
  NativeTextStylingProps<UtilityLabelProps>,
  'htmlFor' | 'as'
>;

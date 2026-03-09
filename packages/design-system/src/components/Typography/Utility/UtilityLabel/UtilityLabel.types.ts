import type { AccessibilityProps, BaseProps } from '@/types/globalTypes';

export const UTILITY_LABEL_SIZES = ['small', 'medium', 'large'] as const;
export const UTILITY_LABEL_WEIGHTS = ['regular', 'semibold'] as const;

export type UtilityLabelSize = (typeof UTILITY_LABEL_SIZES)[number];
export type UtilityLabelWeight = (typeof UTILITY_LABEL_WEIGHTS)[number];

export interface UtilityLabelProps extends BaseProps, AccessibilityProps {
  size: UtilityLabelSize;
  weight?: UtilityLabelWeight;
  capitalize?: boolean;
  id?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

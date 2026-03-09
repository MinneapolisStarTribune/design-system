import type { AccessibilityProps, BaseProps, FontWeight, Size } from '@/types/globalTypes';

export const EDITORIAL_TEXT_WEIGHTS = ['regular', 'bold'] as const satisfies readonly Extract<
  FontWeight,
  'regular' | 'bold'
>[];

export const EDITORIAL_TEXT_SIZES = [
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
] as const satisfies readonly Size[];

export type EditorialTextWeight = (typeof EDITORIAL_TEXT_WEIGHTS)[number];
export type EditorialTextSize = (typeof EDITORIAL_TEXT_SIZES)[number];

export interface EditorialTextProps extends BaseProps, AccessibilityProps {
  size: EditorialTextSize;
  weight?: EditorialTextWeight;
  children: React.ReactNode;
}

import type { HTMLAttributes } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { ColorVariantProps, TextColor } from '@/types';

/** Semantic heading level; maps to h1-h6 and typography class suffix. */
export const SPONSORED_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4, 5, 6] as const satisfies readonly (
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
)[];

export type SponsoredHeadingImportance = (typeof SPONSORED_HEADING_IMPORTANCE_LEVELS)[number];

export interface SponsoredHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'children' | 'color'>,
    ColorVariantProps {
  importance: SponsoredHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

/** React Native — no DOM / `className` / `HTMLAttributes`. */
export interface SponsoredHeadingNativeProps {
  importance: SponsoredHeadingImportance;
  children: React.ReactNode;
  color?: TextColor;
  id?: string;
  dataTestId?: string;
  style?: StyleProp<TextStyle>;
  'aria-label'?: string;
}

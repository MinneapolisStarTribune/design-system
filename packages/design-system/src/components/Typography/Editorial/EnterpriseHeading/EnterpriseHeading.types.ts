import type { HTMLAttributes } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { ColorVariantProps, TextColor } from '@/types';

/** Semantic heading level; maps to h1-h6 and typography class suffix. */
export const ENTERPRISE_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4, 5, 6] as const satisfies readonly (
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
)[];

export type EnterpriseHeadingImportance = (typeof ENTERPRISE_HEADING_IMPORTANCE_LEVELS)[number];

export interface EnterpriseHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'children' | 'color'>,
    ColorVariantProps {
  importance: EnterpriseHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

/** React Native — no DOM / `className` / `HTMLAttributes`. */
export interface EnterpriseHeadingNativeProps {
  importance: EnterpriseHeadingImportance;
  children: React.ReactNode;
  color?: TextColor;
  id?: string;
  dataTestId?: string;
  style?: StyleProp<TextStyle>;
  'aria-label'?: string;
}

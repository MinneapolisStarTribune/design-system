import type { HTMLAttributes } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { ColorVariantProps, TextColor } from '@/types';

/** Semantic heading level; maps to h1-h6 and typography class suffix. */
export const NEWS_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4, 5, 6] as const satisfies readonly (
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
)[];

export type NewsHeadingImportance = (typeof NEWS_HEADING_IMPORTANCE_LEVELS)[number];

/** Shared by web and native (no DOM attrs, `className`, or RN-only styling). */
export interface NewsHeadingBaseProps {
  importance: NewsHeadingImportance;
  children: React.ReactNode;
  id?: string;
  'aria-label'?: string;
}

export interface NewsHeadingProps
  extends Omit<
      HTMLAttributes<HTMLHeadingElement>,
      'className' | 'children' | 'color' | keyof NewsHeadingBaseProps
    >,
    ColorVariantProps,
    NewsHeadingBaseProps {
  className?: string;
}

/** React Native — no DOM / `className` / `HTMLAttributes`. */
export interface NewsHeadingNativeProps extends NewsHeadingBaseProps {
  color?: TextColor;
  dataTestId?: string;
  style?: StyleProp<TextStyle>;
}

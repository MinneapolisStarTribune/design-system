import type { HTMLAttributes } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { ColorVariantProps, TextColor } from '@/types';

/** Semantic heading level; maps to h1–h6 and typography class suffix. */
export const ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS = [
  1, 2, 3, 4, 5, 6,
] as const satisfies readonly (1 | 2 | 3 | 4 | 5 | 6)[];

export type ArticleBodyHeadingImportance = (typeof ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS)[number];

export interface ArticleBodyHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'children' | 'color'>,
    ColorVariantProps {
  importance: ArticleBodyHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/** React Native — no DOM / `className` / `HTMLAttributes`. */
export interface ArticleBodyHeadingNativeProps {
  importance: ArticleBodyHeadingImportance;
  children: React.ReactNode;
  color?: TextColor;
  id?: string;
  dataTestId?: string;
  style?: StyleProp<TextStyle>;
}

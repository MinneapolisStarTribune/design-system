import type { HTMLAttributes } from 'react';
import type { ColorVariantProps } from '@/types';

/** Semantic heading level; maps to h1-h6 and typography class suffix. */
export const ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS = [
  1, 2, 3, 4, 5, 6,
] as const satisfies readonly (1 | 2 | 3 | 4 | 5 | 6)[];

export type ArticleBodySponsoredHeadingImportance =
  (typeof ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS)[number];

export interface ArticleBodySponsoredHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'children' | 'color'>,
    ColorVariantProps {
  importance: ArticleBodySponsoredHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

import type { HTMLAttributes } from 'react';

/** Semantic heading level; maps to h1-h6 and typography class suffix. */
export type ArticleBodySponsoredHeadingImportance = 1 | 2 | 3 | 4 | 5 | 6;
export const ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS = [
  1, 2, 3, 4, 5, 6,
] as const satisfies readonly ArticleBodySponsoredHeadingImportance[];

export interface ArticleBodySponsoredHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'children'> {
  importance: ArticleBodySponsoredHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

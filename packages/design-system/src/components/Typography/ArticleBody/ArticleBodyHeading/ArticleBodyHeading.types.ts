import type { HTMLAttributes } from 'react';

/** Semantic heading level; maps to h1–h6 and typography class suffix. */
export type ArticleBodyHeadingImportance = 1 | 2 | 3 | 4 | 5 | 6;
export const ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS = [
  1, 2, 3, 4, 5, 6,
] as const satisfies readonly ArticleBodyHeadingImportance[];

export interface ArticleBodyHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'children'> {
  importance: ArticleBodyHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

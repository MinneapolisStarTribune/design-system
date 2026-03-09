import type { HTMLAttributes } from 'react';

/** Semantic heading level; maps to h1-h6 and typography class suffix. */
export const NON_NEWS_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4, 5, 6] as const satisfies readonly (
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
)[];

export type NonNewsHeadingImportance = (typeof NON_NEWS_HEADING_IMPORTANCE_LEVELS)[number];

export interface NonNewsHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'children'> {
  importance: NonNewsHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

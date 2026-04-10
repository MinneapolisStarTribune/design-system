import { ColorVariantProps } from '@/types';
import type { HTMLAttributes } from 'react';

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

export interface NewsHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'children' | 'color'>,
    ColorVariantProps {
  importance: NewsHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

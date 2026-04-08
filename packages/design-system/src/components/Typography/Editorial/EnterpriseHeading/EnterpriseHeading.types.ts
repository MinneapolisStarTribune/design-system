import { TypographyVariantProps } from '@/types';
import type { HTMLAttributes } from 'react';

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
    TypographyVariantProps {
  importance: EnterpriseHeadingImportance;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

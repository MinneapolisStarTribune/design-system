import type { BaseProps, ColorVariantProps } from '@/types/globalTypes';

export const PAGE_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4] as const;
export type PageHeadingImportance = (typeof PAGE_HEADING_IMPORTANCE_LEVELS)[number];

export interface PageHeadingProps extends BaseProps, ColorVariantProps {
  importance: PageHeadingImportance;
  children: React.ReactNode;
  className?: string;
}

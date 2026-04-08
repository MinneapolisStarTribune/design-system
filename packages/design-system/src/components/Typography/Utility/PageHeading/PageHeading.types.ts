import type { BaseProps, TypographyVariantProps } from '@/types/globalTypes';

export const PAGE_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4] as const;
export type PageHeadingImportance = (typeof PAGE_HEADING_IMPORTANCE_LEVELS)[number];

export interface PageHeadingProps extends BaseProps, TypographyVariantProps {
  importance: PageHeadingImportance;
  children: React.ReactNode;
  className?: string;
}

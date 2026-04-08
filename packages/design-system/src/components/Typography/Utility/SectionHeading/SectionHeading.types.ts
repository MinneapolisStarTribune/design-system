import type { AccessibilityProps, BaseProps, TypographyVariantProps } from '@/types/globalTypes';

export const SECTION_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export type SectionHeadingImportance = (typeof SECTION_HEADING_IMPORTANCE_LEVELS)[number];

export interface SectionHeadingProps extends BaseProps, AccessibilityProps, TypographyVariantProps {
  importance: SectionHeadingImportance;
  children: React.ReactNode;
}

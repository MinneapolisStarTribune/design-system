import type { AccessibilityProps, BaseProps } from '@/types/globalTypes';

export const SECTION_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export type SectionHeadingImportance = (typeof SECTION_HEADING_IMPORTANCE_LEVELS)[number];

export interface SectionHeadingProps extends BaseProps, AccessibilityProps {
  importance: SectionHeadingImportance;
  children: React.ReactNode;
}

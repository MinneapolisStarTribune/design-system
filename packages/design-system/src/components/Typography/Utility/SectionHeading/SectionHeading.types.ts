import type { AccessibilityProps, BaseProps, ColorVariantProps } from '@/types/globalTypes';
import type { NativeTextStylingProps } from '@/types/native-base-props';

export const SECTION_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export type SectionHeadingImportance = (typeof SECTION_HEADING_IMPORTANCE_LEVELS)[number];

export interface SectionHeadingProps extends BaseProps, AccessibilityProps, ColorVariantProps {
  importance: SectionHeadingImportance;
  children: React.ReactNode;
}

export type SectionHeadingNativeProps = NativeTextStylingProps<SectionHeadingProps>;

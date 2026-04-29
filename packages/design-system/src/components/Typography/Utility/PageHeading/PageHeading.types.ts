import type { BaseProps, ColorVariantProps } from '@/types/globalTypes';
import type { NativeTextStylingProps } from '@/types/native-base-props';

export const PAGE_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4] as const;
export type PageHeadingImportance = (typeof PAGE_HEADING_IMPORTANCE_LEVELS)[number];

export interface PageHeadingProps extends BaseProps, ColorVariantProps {
  importance: PageHeadingImportance;
  children: React.ReactNode;
  className?: string;
}

export type PageHeadingNativeProps = NativeTextStylingProps<PageHeadingProps>;

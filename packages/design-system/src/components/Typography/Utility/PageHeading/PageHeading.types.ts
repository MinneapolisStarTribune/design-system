import type { BaseProps, ColorVariantProps, HeadingLevels } from '@/types/globalTypes';
import type { NativeTextStylingProps } from '@/types/native-base-props';

export const PAGE_HEADING_IMPORTANCE_LEVELS = [1, 2, 3, 4] as const;
export type PageHeadingImportance = (typeof PAGE_HEADING_IMPORTANCE_LEVELS)[number];
type PageHeadingLevels = Extract<HeadingLevels, 'h1' | 'h2' | 'h3' | 'h4'>;

export interface PageHeadingProps extends BaseProps, ColorVariantProps {
  importance: PageHeadingImportance;
  as?: PageHeadingLevels;
  children: React.ReactNode;
  className?: string;
}

export type PageHeadingNativeProps = NativeTextStylingProps<Omit<PageHeadingProps, 'as'>>;

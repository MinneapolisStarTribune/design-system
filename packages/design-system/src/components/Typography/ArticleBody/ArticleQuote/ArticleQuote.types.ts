import type { AccessibilityProps, BaseProps, Size, ColorVariantProps } from '@/types/globalTypes';

/** Article quote size - small or large */
export const ARTICLE_QUOTE_SIZES = ['small', 'large'] as const satisfies readonly Extract<
  Size,
  'small' | 'large'
>[];

export type ArticleQuoteSize = (typeof ARTICLE_QUOTE_SIZES)[number];

export interface ArticleQuoteProps extends BaseProps, AccessibilityProps, ColorVariantProps {
  /** Size variant - small or large */
  size?: ArticleQuoteSize;
  children: React.ReactNode;
}

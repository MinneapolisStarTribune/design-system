import type { AccessibilityProps, BaseProps, Size } from '@/types/globalTypes';

/** Article quote size - small or large */
export type ArticleQuoteSize = Extract<Size, 'small' | 'large'>;
export const ARTICLE_QUOTE_SIZES = [
  'small',
  'large',
] as const satisfies readonly ArticleQuoteSize[];

export interface ArticleQuoteProps extends BaseProps, AccessibilityProps {
  /** Size variant - small or large */
  size?: ArticleQuoteSize;
  children: React.ReactNode;
}

import type { AccessibilityProps, BaseProps, Size } from '@/types/globalTypes';

/** Article quote size - small or large */
export type ArticleQuoteSize = Extract<Size, 'small' | 'large'>;

export interface ArticleQuoteProps extends BaseProps, AccessibilityProps {
  /** Size variant - small or large */
  size?: ArticleQuoteSize;
  children: React.ReactNode;
}

import type { AccessibilityProps, BaseProps, FontWeight } from '@/types/globalTypes';

export const ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS = [
  'regular',
  'italic',
  'semibold',
  'semibold-italic',
] as const satisfies readonly Extract<
  FontWeight,
  'regular' | 'italic' | 'semibold' | 'semibold-italic'
>[];

export type ArticleBodySponsoredTextWeight = (typeof ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS)[number];

export interface ArticleBodySponsoredTextProps extends BaseProps, AccessibilityProps {
  weight?: ArticleBodySponsoredTextWeight;
  children: React.ReactNode;
}

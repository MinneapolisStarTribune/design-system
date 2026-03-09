import type { AccessibilityProps, BaseProps, FontWeight } from '@/types/globalTypes';

export type ArticleBodySponsoredTextWeight = Extract<
  FontWeight,
  'regular' | 'italic' | 'semibold' | 'semibold-italic'
>;

export const ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS = [
  'regular',
  'italic',
  'semibold',
  'semibold-italic',
] as const satisfies readonly ArticleBodySponsoredTextWeight[];

export interface ArticleBodySponsoredTextProps extends BaseProps, AccessibilityProps {
  weight?: ArticleBodySponsoredTextWeight;
  children: React.ReactNode;
}

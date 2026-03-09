import type { AccessibilityProps, BaseProps, FontWeight } from '@/types/globalTypes';

export type ArticleBodyTextWeight = Extract<
  FontWeight,
  'regular' | 'italic' | 'bold' | 'bold-italic' | 'dropcap'
>;

export const ARTICLE_BODY_TEXT_WEIGHTS = [
  'regular',
  'italic',
  'bold',
  'bold-italic',
  'dropcap',
] as const satisfies readonly ArticleBodyTextWeight[];

export interface ArticleBodyTextProps extends BaseProps, AccessibilityProps {
  weight?: ArticleBodyTextWeight;
  children: React.ReactNode;
}

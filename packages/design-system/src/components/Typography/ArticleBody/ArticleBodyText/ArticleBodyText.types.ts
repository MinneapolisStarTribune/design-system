import type { AccessibilityProps, BaseProps, FontWeight } from '@/types/globalTypes';

export const ARTICLE_BODY_TEXT_WEIGHTS = [
  'regular',
  'italic',
  'bold',
  'bold-italic',
  'dropcap',
] as const satisfies readonly Extract<
  FontWeight,
  'regular' | 'italic' | 'bold' | 'bold-italic' | 'dropcap'
>[];

export type ArticleBodyTextWeight = (typeof ARTICLE_BODY_TEXT_WEIGHTS)[number];

export interface ArticleBodyTextProps extends BaseProps, AccessibilityProps {
  weight?: ArticleBodyTextWeight;
  children: React.ReactNode;
}

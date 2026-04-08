import type {
  AccessibilityProps,
  BaseProps,
  FontWeight,
  TypographyVariantProps,
} from '@/types/globalTypes';

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

export interface ArticleBodyTextProps
  extends BaseProps,
    AccessibilityProps,
    TypographyVariantProps {
  weight?: ArticleBodyTextWeight;
  children: React.ReactNode;
}

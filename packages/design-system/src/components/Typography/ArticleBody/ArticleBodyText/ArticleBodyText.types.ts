import type {
  AccessibilityProps,
  BaseProps,
  FontWeight,
  ColorVariantProps,
} from '@/types/globalTypes';
import type { NativeTextStylingProps } from '@/types/native-base-props';

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

export interface ArticleBodyTextProps extends BaseProps, AccessibilityProps, ColorVariantProps {
  weight?: ArticleBodyTextWeight;
  children: React.ReactNode;
}

export type ArticleBodyTextNativeProps = NativeTextStylingProps<ArticleBodyTextProps>;

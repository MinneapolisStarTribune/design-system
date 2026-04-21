import type { HTMLAttributes } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { ColorVariantProps, TextColor } from '@/types';

/** Semantic heading level; maps to h1-h6 and typography class suffix. */
export const ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS = [
  1, 2, 3, 4, 5, 6,
] as const satisfies readonly (1 | 2 | 3 | 4 | 5 | 6)[];

export type ArticleBodySponsoredHeadingImportance =
  (typeof ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS)[number];

/** Shared by web and native (no DOM attrs, `className`, or RN-only styling). */
export interface ArticleBodySponsoredHeadingBaseProps {
  importance: ArticleBodySponsoredHeadingImportance;
  children: React.ReactNode;
  id?: string;
  'aria-label'?: string;
}

export interface ArticleBodySponsoredHeadingProps
  extends Omit<
      HTMLAttributes<HTMLHeadingElement>,
      'className' | 'children' | 'color' | keyof ArticleBodySponsoredHeadingBaseProps
    >,
    ColorVariantProps,
    ArticleBodySponsoredHeadingBaseProps {
  className?: string;
}

/**
 * React Native entry — no `className` or `HTMLAttributes`.
 *
 * - **`color`** — Same semantic `TextColor` tokens as web via `ColorVariantProps` on
 *   {@link ArticleBodySponsoredHeadingProps}; listed here because native does not extend that web
 *   `extends` chain.
 * - **`dataTestId`** — Same testing hook as on `BaseProps` in `globalTypes`; maps to `testID` on the
 *   native `Text`.
 * - **`style`** — Optional RN overrides (`StyleProp<TextStyle>`); replaces web `className` / CSS style.
 */
export interface ArticleBodySponsoredHeadingNativeProps
  extends ArticleBodySponsoredHeadingBaseProps {
  color?: TextColor;
  dataTestId?: string;
  style?: StyleProp<TextStyle>;
}

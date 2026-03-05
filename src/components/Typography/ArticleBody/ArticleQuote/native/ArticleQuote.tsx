import React, { useContext, useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import type { ArticleQuoteProps, ArticleQuoteSize } from '../ArticleQuote.types';

export type { ArticleQuoteProps, ArticleQuoteSize };
import { BrandContext } from '@/providers/brand/BrandContext';
import type { Brand } from '@/providers/theme-helpers';

// Typography tokens - built by yarn tokens, resolved at build time via vite alias
import startribuneTypography from '@mobile/typography/startribune-typography.js';
import varsityTypography from '@mobile/typography/varsity-typography.js';

/** Font family mapping for token references - matches tokens/text.json */
const FONT_FAMILY_MAP: Record<string, string> = {
  '{font.family.publico-headline}': 'Publico Headline',
  '{font.family.publico-text}': 'Publico Text',
  '{font.family.nohemi}': 'Nohemi',
  '{font.family.barlow}': 'Barlow',
  '{font.family.barlow-condensed}': 'Barlow Condensed',
  '{font.family.graphik}': 'Graphik',
};

function resolveFontFamily(ref: string): string {
  return FONT_FAMILY_MAP[ref] ?? ref;
}

function getTypographyStyles(brand: Brand) {
  const typography =
    brand === 'startribune' ? startribuneTypography.default : varsityTypography.default;

  const smallRaw = typography.articleQuoteSmall ?? {};
  const largeRaw = typography.articleQuoteLarge ?? {};

  const toStyle = (raw: Record<string, unknown>) => {
    const style: Record<string, unknown> = {};
    if (raw.fontFamily) {
      style.fontFamily = resolveFontFamily(raw.fontFamily as string);
    }
    if (typeof raw.fontSize === 'number') style.fontSize = raw.fontSize;
    if (raw.fontWeight) style.fontWeight = raw.fontWeight as string;
    if (raw.fontStyle) style.fontStyle = raw.fontStyle as string;
    if (raw.lineHeight) style.lineHeight = raw.lineHeight as number;
    if (raw.letterSpacing) style.letterSpacing = raw.letterSpacing as number;
    return style;
  };

  return {
    small: StyleSheet.create({ quote: toStyle(smallRaw) }).quote,
    large: StyleSheet.create({ quote: toStyle(largeRaw) }).quote,
  };
}

export const ArticleQuote: React.FC<ArticleQuoteProps> = (props) => {
  const { size = 'large', children, dataTestId = 'article-quote', ...rest } = props;

  const brand = useContext(BrandContext) ?? 'startribune';
  const styles = useMemo(() => getTypographyStyles(brand), [brand]);
  const quoteStyle = size === 'small' ? styles.small : styles.large;

  return (
    <Text
      style={quoteStyle}
      testID={dataTestId}
      accessibilityRole="none"
      {...(rest as React.ComponentProps<typeof Text>)}
    >
      {children}
    </Text>
  );
};

ArticleQuote.displayName = 'ArticleQuote';

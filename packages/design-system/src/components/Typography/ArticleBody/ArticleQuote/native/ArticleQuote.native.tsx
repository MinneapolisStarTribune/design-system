import React, { useContext } from 'react';
import { Text, type TextStyle } from 'react-native';
import type { ArticleQuoteNativeProps } from '../ArticleQuote.types';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import { DesignSystemContext } from '@/providers/DesignSystemContext';

export const ArticleQuote: React.FC<ArticleQuoteNativeProps> = (props) => {
  const { size = 'large', children, dataTestId = 'article-quote', ...rest } = props;

  const styles = useNativeStylesWithDefaults(createStyles);
  const context = useContext(DesignSystemContext);
  const brand = context?.brand ?? 'startribune';
  const brandTypography =
    brand === 'startribune'
      ? size === 'large'
        ? styles.startribuneLarge
        : styles.startribuneSmall
      : size === 'large'
        ? styles.varsityLarge
        : styles.varsitySmall;

  return (
    <Text
      style={[styles[size], brandTypography]}
      testID={dataTestId}
      accessibilityRole="none"
      {...(rest as React.ComponentProps<typeof Text>)}
    >
      {children}
    </Text>
  );
};

const createStyles = (theme: NativeTheme) => ({
  small: {
    ...theme.typographyArticleQuoteSmall,
  },
  large: {
    ...theme.typographyArticleQuoteLarge,
  },
  startribuneSmall: {
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    fontWeight: '400',
  } satisfies TextStyle,
  startribuneLarge: {
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    fontWeight: '400',
  } satisfies TextStyle,
  varsitySmall: {
    fontFamily: 'Nohemi',
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.66,
  } satisfies TextStyle,
  varsityLarge: {
    fontFamily: 'Nohemi',
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.56,
  } satisfies TextStyle,
});

export type { ArticleQuoteNativeProps as ArticleQuoteProps } from '../ArticleQuote.types';
export type { ArticleQuoteSize } from '../ArticleQuote.types';

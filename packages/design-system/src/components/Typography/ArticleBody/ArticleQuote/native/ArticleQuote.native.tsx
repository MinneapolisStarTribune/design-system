import React from 'react';
import { Text } from 'react-native';
import type { ArticleQuoteProps } from '../ArticleQuote.types';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';

export const ArticleQuote: React.FC<ArticleQuoteProps> = (props) => {
  const { size = 'large', children, dataTestId = 'article-quote', ...rest } = props;

  const styles = useNativeStylesWithDefaults(createStyles);

  return (
    <Text
      style={styles[size]}
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
});

export type { ArticleQuoteProps, ArticleQuoteSize } from '../ArticleQuote.types';

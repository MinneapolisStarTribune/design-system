import React from 'react';
import { Text } from 'react-native';
import type { ArticleQuoteProps, ArticleQuoteSize } from '../ArticleQuote.types';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import { useNativeTokens } from '@/hooks/useNativeTokens';
import { createNativeTypographyStylesWithDefaults } from '@/styles/nativeTypography';

export const ArticleQuote: React.FC<ArticleQuoteProps> = (props) => {
  const { size = 'large', children, dataTestId = 'article-quote', ...rest } = props;

  const styles = useNativeStyles(createStyles);

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

const createStyles = (theme: ReturnType<typeof useNativeTokens>['theme']) =>
  createNativeTypographyStylesWithDefaults(theme, {
    small: {
      ...theme.typographyArticleQuoteSmall,
    },
    large: {
      ...theme.typographyArticleQuoteLarge,
    },
  });

export type { ArticleQuoteProps, ArticleQuoteSize };

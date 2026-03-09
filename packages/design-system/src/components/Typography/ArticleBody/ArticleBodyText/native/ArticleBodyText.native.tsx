import React from 'react';
import { Text } from 'react-native';
import camelCase from 'lodash/camelCase';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { ArticleBodyTextProps, ArticleBodyTextWeight } from '../ArticleBodyText.types';

export const ArticleBodyText: React.FC<ArticleBodyTextProps> = (props) => {
  const { weight = 'regular', children, dataTestId = 'article-body-text', ...rest } = props;
  const styles = useNativeStylesWithDefaults(createStyles);
  const styleKey = camelCase(weight) as keyof typeof styles;

  return (
    <Text
      style={styles[styleKey]}
      accessibilityRole="text"
      testID={dataTestId}
      {...(rest as React.ComponentProps<typeof Text>)}
    >
      {children}
    </Text>
  );
};

const createStyles = (theme: NativeTheme) => ({
  regular: { ...theme.typographyArticleBodyRegular },
  italic: { ...theme.typographyArticleBodyItalic },
  bold: { ...theme.typographyArticleBodyBold },
  boldItalic: { ...theme.typographyArticleBodyBoldItalic },
  dropcap: { ...theme.typographyArticleBodyDropcap },
});

export type { ArticleBodyTextProps, ArticleBodyTextWeight };

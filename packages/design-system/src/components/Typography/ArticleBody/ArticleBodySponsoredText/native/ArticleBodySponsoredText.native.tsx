import React from 'react';
import { Text } from 'react-native';
import camelCase from 'lodash/camelCase';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type {
  ArticleBodySponsoredTextProps,
  ArticleBodySponsoredTextWeight,
} from '../ArticleBodySponsoredText.types';

export const ArticleBodySponsoredText: React.FC<ArticleBodySponsoredTextProps> = (props) => {
  const {
    weight = 'regular',
    children,
    dataTestId = 'article-body-text-sponsored',
    ...rest
  } = props;
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

const createStyles = (theme: NativeTheme) => {
  // Sponsored typography tokens are not shared across all NativeTheme variants
  // (they exist on Star Tribune, not Varsity), so we locally narrow for access.
  const sponsoredTheme = theme as NativeTheme &
    Record<
      | 'typographyArticleBodySponsoredRegular'
      | 'typographyArticleBodySponsoredItalic'
      | 'typographyArticleBodySponsoredSemibold'
      | 'typographyArticleBodySponsoredSemiboldItalic',
      NativeTheme['typographyArticleBodyRegular']
    >;

  return {
    regular: { ...sponsoredTheme.typographyArticleBodySponsoredRegular },
    italic: { ...sponsoredTheme.typographyArticleBodySponsoredItalic },
    semibold: { ...sponsoredTheme.typographyArticleBodySponsoredSemibold },
    semiboldItalic: { ...sponsoredTheme.typographyArticleBodySponsoredSemiboldItalic },
  };
};

export type { ArticleBodySponsoredTextProps, ArticleBodySponsoredTextWeight };

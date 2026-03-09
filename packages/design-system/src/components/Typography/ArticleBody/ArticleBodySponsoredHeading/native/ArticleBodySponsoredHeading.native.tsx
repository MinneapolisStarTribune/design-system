import React from 'react';
import { Text } from 'react-native';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { ArticleBodySponsoredHeadingProps } from '../ArticleBodySponsoredHeading.types';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type ArticleBodySponsoredHeadingImportance = ArticleBodySponsoredHeadingProps['importance'];

const importanceToStyleKey: Record<ArticleBodySponsoredHeadingImportance, StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

type SponsoredHeadingTypographyTokens = {
  typographyArticleBodySponsoredH1: NativeTheme['typographyArticleBodyH1'];
  typographyArticleBodySponsoredH2: NativeTheme['typographyArticleBodyH2'];
  typographyArticleBodySponsoredH3: NativeTheme['typographyArticleBodyH3'];
  typographyArticleBodySponsoredH4: NativeTheme['typographyArticleBodyH4'];
  typographyArticleBodySponsoredH5: NativeTheme['typographyArticleBodyH5'];
  typographyArticleBodySponsoredH6: NativeTheme['typographyArticleBodyH6'];
};

export const ArticleBodySponsoredHeading: React.FC<ArticleBodySponsoredHeadingProps> = (props) => {
  const { importance, children, ...rest } = props;
  useBrandValidation('ArticleBodySponsoredHeading');

  const styles = useNativeStylesWithDefaults(createStyles);
  const styleKey = importanceToStyleKey[importance];

  return (
    <Text
      style={styles[styleKey]}
      accessibilityRole="header"
      {...(rest as React.ComponentProps<typeof Text>)}
    >
      {children}
    </Text>
  );
};

const createStyles = (theme: NativeTheme) => {
  // Sponsored heading tokens exist only on Star Tribune typography; brand validation enforces that at runtime.
  const sponsoredTheme = theme as NativeTheme & SponsoredHeadingTypographyTokens;

  return {
    h1: { ...sponsoredTheme.typographyArticleBodySponsoredH1 },
    h2: { ...sponsoredTheme.typographyArticleBodySponsoredH2 },
    h3: { ...sponsoredTheme.typographyArticleBodySponsoredH3 },
    h4: { ...sponsoredTheme.typographyArticleBodySponsoredH4 },
    h5: { ...sponsoredTheme.typographyArticleBodySponsoredH5 },
    h6: { ...sponsoredTheme.typographyArticleBodySponsoredH6 },
  };
};

export type {
  ArticleBodySponsoredHeadingProps,
  ArticleBodySponsoredHeadingImportance,
} from '../ArticleBodySponsoredHeading.types';

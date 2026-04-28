import React from 'react';
import { Text } from 'react-native';
import type { ArticleBodyHeadingImportance } from '../ArticleBodyHeading.types';
import type { ArticleBodyHeadingNativeProps } from '../ArticleBodyHeading.types';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const importanceToStyleKey: Record<ArticleBodyHeadingImportance, StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const ArticleBodyHeading: React.FC<ArticleBodyHeadingNativeProps> = (props) => {
  const { importance, children, ...rest } = props;

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

const createStyles = (theme: NativeTheme) => ({
  h1: { ...theme.typographyArticleBodyH1 },
  h2: { ...theme.typographyArticleBodyH2 },
  h3: { ...theme.typographyArticleBodyH3 },
  h4: { ...theme.typographyArticleBodyH4 },
  h5: { ...theme.typographyArticleBodyH5 },
  h6: { ...theme.typographyArticleBodyH6 },
});

export type { ArticleBodyHeadingNativeProps as ArticleBodyHeadingProps } from '../ArticleBodyHeading.types';
export type { ArticleBodyHeadingImportance } from '../ArticleBodyHeading.types';

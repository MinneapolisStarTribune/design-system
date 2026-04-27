import React from 'react';
import { Text } from 'react-native';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { NewsHeadingImportance } from '../NewsHeading.types';
import type { NewsHeadingNativeProps } from '../NewsHeading.types';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const importanceToStyleKey: Record<NewsHeadingImportance, StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const NewsHeading: React.FC<NewsHeadingNativeProps> = (props) => {
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
  h1: { ...theme.typographyEditorialNewsH1 },
  h2: { ...theme.typographyEditorialNewsH2 },
  h3: { ...theme.typographyEditorialNewsH3 },
  h4: { ...theme.typographyEditorialNewsH4 },
  h5: { ...theme.typographyEditorialNewsH5 },
  h6: { ...theme.typographyEditorialNewsH6 },
});

export type { NewsHeadingNativeProps as NewsHeadingProps } from '../NewsHeading.types';
export type { NewsHeadingImportance } from '../NewsHeading.types';

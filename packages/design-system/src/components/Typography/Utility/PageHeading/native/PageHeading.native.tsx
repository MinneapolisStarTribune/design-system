import React from 'react';
import { Text } from 'react-native';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { PageHeadingImportance } from '../PageHeading.types';
import type { PageHeadingNativeProps } from '../PageHeading.types';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4';

const importanceToStyleKey: Record<PageHeadingImportance, StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
};

export const PageHeading: React.FC<PageHeadingNativeProps> = (props) => {
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
  h1: { ...theme.typographyUtilityPageH1 },
  h2: { ...theme.typographyUtilityPageH2 },
  h3: { ...theme.typographyUtilityPageH3 },
  h4: { ...theme.typographyUtilityPageH4 },
});

export type { PageHeadingNativeProps as PageHeadingProps } from '../PageHeading.types';
export type { PageHeadingImportance } from '../PageHeading.types';

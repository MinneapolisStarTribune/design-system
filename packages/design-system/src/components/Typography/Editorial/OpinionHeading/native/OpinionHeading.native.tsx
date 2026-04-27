import React from 'react';
import { Text } from 'react-native';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { OpinionHeadingImportance } from '../OpinionHeading.types';
import type { OpinionHeadingNativeProps } from '../OpinionHeading.types';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const importanceToStyleKey: Record<OpinionHeadingImportance, StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const OpinionHeading: React.FC<OpinionHeadingNativeProps> = (props) => {
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
  h1: { ...theme.typographyEditorialOpinionH1 },
  h2: { ...theme.typographyEditorialOpinionH2 },
  h3: { ...theme.typographyEditorialOpinionH3 },
  h4: { ...theme.typographyEditorialOpinionH4 },
  h5: { ...theme.typographyEditorialOpinionH5 },
  h6: { ...theme.typographyEditorialOpinionH6 },
});

export type { OpinionHeadingNativeProps as OpinionHeadingProps } from '../OpinionHeading.types';
export type { OpinionHeadingImportance } from '../OpinionHeading.types';

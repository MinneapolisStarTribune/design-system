import React from 'react';
import { Text } from 'react-native';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { OpinionHeadingProps } from '../OpinionHeading.types';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const importanceToStyleKey: Record<OpinionHeadingProps['importance'], StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const OpinionHeading: React.FC<OpinionHeadingProps> = (props) => {
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

export type { OpinionHeadingImportance, OpinionHeadingProps } from '../OpinionHeading.types';

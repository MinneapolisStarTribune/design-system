import React from 'react';
import { Text } from 'react-native';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { SectionHeadingProps } from '../SectionHeading.types';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const importanceToStyleKey: Record<SectionHeadingProps['importance'], StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const SectionHeading: React.FC<SectionHeadingProps> = (props) => {
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
  h1: { ...theme.typographyUtilitySectionH1 },
  h2: { ...theme.typographyUtilitySectionH2 },
  h3: { ...theme.typographyUtilitySectionH3 },
  h4: { ...theme.typographyUtilitySectionH4 },
  h5: { ...theme.typographyUtilitySectionH5 },
  h6: { ...theme.typographyUtilitySectionH6 },
});

export type { SectionHeadingImportance, SectionHeadingProps } from '../SectionHeading.types';

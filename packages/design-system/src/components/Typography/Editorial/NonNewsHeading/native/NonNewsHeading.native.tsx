import React from 'react';
import { Text } from 'react-native';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { NonNewsHeadingProps } from '../NonNewsHeading.types';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const importanceToStyleKey: Record<NonNewsHeadingProps['importance'], StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const NonNewsHeading: React.FC<NonNewsHeadingProps> = (props) => {
  const { importance, children, ...rest } = props;
  useBrandValidation('NonNewsHeading');
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
  // Non-news heading tokens are missing on some brand token sets due to it not being supported..
  // Fall back to heading tokens so the component remains cross-brand.
  const nonNewsTheme = theme as NativeTheme &
    Record<
      | 'typographyEditorialNonNewsH1'
      | 'typographyEditorialNonNewsH2'
      | 'typographyEditorialNonNewsH3'
      | 'typographyEditorialNonNewsH4'
      | 'typographyEditorialNonNewsH5'
      | 'typographyEditorialNonNewsH6',
      NativeTheme['typographyArticleBodyH1']
    >;

  return {
    h1: { ...nonNewsTheme.typographyEditorialNonNewsH1 },
    h2: { ...nonNewsTheme.typographyEditorialNonNewsH2 },
    h3: { ...nonNewsTheme.typographyEditorialNonNewsH3 },
    h4: { ...nonNewsTheme.typographyEditorialNonNewsH4 },
    h5: { ...nonNewsTheme.typographyEditorialNonNewsH5 },
    h6: { ...nonNewsTheme.typographyEditorialNonNewsH6 },
  };
};

export type { NonNewsHeadingImportance, NonNewsHeadingProps } from '../NonNewsHeading.types';

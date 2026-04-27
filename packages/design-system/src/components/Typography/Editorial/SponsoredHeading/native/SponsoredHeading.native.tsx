import React from 'react';
import { Text } from 'react-native';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { SponsoredHeadingImportance } from '../SponsoredHeading.types';
import type { SponsoredHeadingNativeProps } from '../SponsoredHeading.types';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const importanceToStyleKey: Record<SponsoredHeadingImportance, StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const SponsoredHeading: React.FC<SponsoredHeadingNativeProps> = (props) => {
  const { importance, children, ...rest } = props;
  useBrandValidation('SponsoredHeading');
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
  const tokens = theme as NativeTheme & Record<string, NativeTheme['typographyArticleBodyH1']>;

  // Sponsored heading tokens are missing on some brand token sets due to it not being supported..
  // Fall back to heading tokens so the component remains cross-brand.
  return {
    h1: { ...(tokens.typographyEditorialSponsoredH1 ?? theme.typographyEditorialNewsH1) },
    h2: { ...(tokens.typographyEditorialSponsoredH2 ?? theme.typographyEditorialNewsH2) },
    h3: { ...(tokens.typographyEditorialSponsoredH3 ?? theme.typographyEditorialNewsH3) },
    h4: { ...(tokens.typographyEditorialSponsoredH4 ?? theme.typographyEditorialNewsH4) },
    h5: { ...(tokens.typographyEditorialSponsoredH5 ?? theme.typographyEditorialNewsH5) },
    h6: { ...(tokens.typographyEditorialSponsoredH6 ?? theme.typographyEditorialNewsH6) },
  };
};

export type { SponsoredHeadingNativeProps as SponsoredHeadingProps } from '../SponsoredHeading.types';
export type { SponsoredHeadingImportance } from '../SponsoredHeading.types';

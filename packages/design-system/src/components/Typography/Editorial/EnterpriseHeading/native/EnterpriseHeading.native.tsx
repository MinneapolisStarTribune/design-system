import React from 'react';
import { Text } from 'react-native';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { EnterpriseHeadingProps } from '../EnterpriseHeading.types';

type StyleKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const importanceToStyleKey: Record<EnterpriseHeadingProps['importance'], StyleKey> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const EnterpriseHeading: React.FC<EnterpriseHeadingProps> = (props) => {
  const { importance, children, ...rest } = props;
  useBrandValidation('EnterpriseHeading');
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
  // Enterprise heading tokens are not shared across all NativeTheme variants,
  // so we locally narrow the token lookup for these Star Tribune-specific keys.
  const enterpriseTheme = theme as NativeTheme &
    Record<
      | 'typographyEditorialEnterpriseH1'
      | 'typographyEditorialEnterpriseH2'
      | 'typographyEditorialEnterpriseH3'
      | 'typographyEditorialEnterpriseH4'
      | 'typographyEditorialEnterpriseH5'
      | 'typographyEditorialEnterpriseH6',
      NativeTheme['typographyArticleBodyH1']
    >;

  return {
    h1: { ...enterpriseTheme.typographyEditorialEnterpriseH1 },
    h2: { ...enterpriseTheme.typographyEditorialEnterpriseH2 },
    h3: { ...enterpriseTheme.typographyEditorialEnterpriseH3 },
    h4: { ...enterpriseTheme.typographyEditorialEnterpriseH4 },
    h5: { ...enterpriseTheme.typographyEditorialEnterpriseH5 },
    h6: { ...enterpriseTheme.typographyEditorialEnterpriseH6 },
  };
};

export type {
  EnterpriseHeadingImportance,
  EnterpriseHeadingProps,
} from '../EnterpriseHeading.types';

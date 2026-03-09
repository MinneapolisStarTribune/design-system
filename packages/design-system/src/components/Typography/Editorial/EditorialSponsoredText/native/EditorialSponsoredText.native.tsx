import React from 'react';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { Text } from 'react-native';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { EditorialSponsoredTextProps } from '../EditorialSponsoredText.types';
import {
  EDITORIAL_SPONSORED_TEXT_SIZES,
  EDITORIAL_SPONSORED_TEXT_WEIGHTS,
} from '../EditorialSponsoredText.types';

const toTokenSuffix = (value: string) => upperFirst(camelCase(value));

export const EditorialSponsoredText: React.FC<EditorialSponsoredTextProps> = (props) => {
  const {
    size,
    weight = 'regular',
    children,
    dataTestId = 'editorial-text-sponsored',
    ...rest
  } = props;
  const styles = useNativeStylesWithDefaults(createStyles);
  const styleKey = `${weight}-${size}` as keyof typeof styles;

  return (
    <Text
      style={styles[styleKey]}
      accessibilityRole="text"
      testID={dataTestId}
      {...(rest as React.ComponentProps<typeof Text>)}
    >
      {children}
    </Text>
  );
};

const createStyles = (theme: NativeTheme) => {
  // Sponsored editorial tokens are not shared across all NativeTheme variants,
  // so we locally narrow the token lookup for these Star Tribune-specific keys.
  const editorialTheme = theme as NativeTheme &
    Record<string, NativeTheme['typographyArticleBodyRegular']>;

  // Build the full size/weight style map by deriving each token key
  // (e.g. typographyEditorialTextSponsoredRegularMedium) at runtime.
  return Object.fromEntries(
    EDITORIAL_SPONSORED_TEXT_SIZES.flatMap((size) =>
      EDITORIAL_SPONSORED_TEXT_WEIGHTS.map((weight) => {
        const styleKey = `${weight}-${size}`;
        const tokenKey = `typographyEditorialTextSponsored${toTokenSuffix(weight)}${toTokenSuffix(size)}`;
        return [styleKey, { ...editorialTheme[tokenKey] }];
      })
    )
  ) as Record<string, NativeTheme['typographyArticleBodyRegular']>;
};

export type {
  EditorialSponsoredTextProps,
  EditorialSponsoredTextSize,
  EditorialSponsoredTextWeight,
} from '../EditorialSponsoredText.types';

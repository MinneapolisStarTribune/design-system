import React from 'react';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { Text } from 'react-native';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { EditorialTextNativeProps } from '../EditorialText.types';
import { EDITORIAL_TEXT_SIZES, EDITORIAL_TEXT_WEIGHTS } from '../EditorialText.types';

const toTokenSuffix = (value: string) => upperFirst(camelCase(value));

export const EditorialText: React.FC<EditorialTextNativeProps> = (props) => {
  const { size, weight = 'regular', children, dataTestId = 'editorial-text', ...rest } = props;
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
  const editorialTheme = theme as NativeTheme &
    Record<string, NativeTheme['typographyArticleBodyRegular']>;

  // Build the full size/weight style map by deriving each token key
  // (e.g. typographyEditorialTextBoldMedium) at runtime.
  return Object.fromEntries(
    EDITORIAL_TEXT_SIZES.flatMap((size) =>
      EDITORIAL_TEXT_WEIGHTS.map((weight) => {
        const styleKey = `${weight}-${size}`;
        const tokenKey = `typographyEditorialText${toTokenSuffix(weight)}${toTokenSuffix(size)}`;
        return [styleKey, { ...editorialTheme[tokenKey] }];
      })
    )
  ) as Record<string, NativeTheme['typographyArticleBodyRegular']>;
};

export type { EditorialTextNativeProps as EditorialTextProps } from '../EditorialText.types';
export type { EditorialTextSize, EditorialTextWeight } from '../EditorialText.types';

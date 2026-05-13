import React from 'react';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { Text } from 'react-native';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { UtilityBodyNativeProps } from '../UtilityBody.types';
import { UTILITY_BODY_SIZES, UTILITY_BODY_WEIGHTS } from '../UtilityBody.types';

const toTokenSuffix = (value: string) => upperFirst(camelCase(value));

export const UtilityBody: React.FC<UtilityBodyNativeProps> = (props) => {
  const {
    size = 'medium',
    weight = 'regular',
    children,
    dataTestId = 'utility-body',
    style,
    ...rest
  } = props;
  const styles = useNativeStylesWithDefaults(createStyles);
  const styleKey = `${weight}-${size}` as keyof typeof styles;

  return (
    <Text
      style={[styles[styleKey], style]}
      accessibilityRole="text"
      testID={dataTestId}
      {...(rest as React.ComponentProps<typeof Text>)}
    >
      {children}
    </Text>
  );
};

const createStyles = (theme: NativeTheme) => {
  const utilityTheme = theme as NativeTheme &
    Record<string, NativeTheme['typographyUtilityTextRegularMedium']>;

  return Object.fromEntries(
    // Build the full size/weight style map by deriving each token key
    // (e.g. typographyUtilityTextRegularMedium) at runtime.
    UTILITY_BODY_SIZES.flatMap((size) =>
      UTILITY_BODY_WEIGHTS.map((weight) => {
        const styleKey = `${weight}-${size}`;
        const tokenKey = `typographyUtilityText${toTokenSuffix(weight)}${toTokenSuffix(size)}`;
        return [styleKey, { ...utilityTheme[tokenKey] }];
      })
    )
  ) as Record<string, NativeTheme['typographyUtilityTextRegularMedium']>;
};

export type { UtilityBodyNativeProps as UtilityBodyProps } from '../UtilityBody.types';
export type { UtilityBodySize, UtilityBodyWeight } from '../UtilityBody.types';

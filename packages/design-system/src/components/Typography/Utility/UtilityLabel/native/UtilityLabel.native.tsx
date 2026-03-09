import React from 'react';
import upperFirst from 'lodash/upperFirst';
import { Text } from 'react-native';
import { useNativeStylesWithDefaults, type NativeTheme } from '@/hooks/useNativeStyles';
import type { UtilityLabelProps } from '../UtilityLabel.types';
import { UTILITY_LABEL_SIZES, UTILITY_LABEL_WEIGHTS } from '../UtilityLabel.types';

export const UtilityLabel: React.FC<UtilityLabelProps> = (props) => {
  const {
    size,
    weight = 'regular',
    capitalize = false,
    children,
    dataTestId = 'utility-label',
    ...rest
  } = props;
  const styles = useNativeStylesWithDefaults(createStyles);
  const styleKey = `${weight}-${size}-${capitalize ? 'caps' : 'default'}` as keyof typeof styles;

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
  const utilityTheme = theme as NativeTheme &
    Record<string, NativeTheme['typographyUtilityLabelMedium']>;

  return Object.fromEntries(
    UTILITY_LABEL_SIZES.flatMap((size) =>
      UTILITY_LABEL_WEIGHTS.flatMap((weight) =>
        [false, true].map((capitalize) => {
          const styleKey = `${weight}-${size}-${capitalize ? 'caps' : 'default'}`;
          const weightPrefix = weight === 'regular' ? '' : `${upperFirst(weight)}`;
          const tokenKey = `typographyUtilityLabel${weightPrefix}${upperFirst(size)}${capitalize ? 'Caps' : ''}`;
          return [styleKey, { ...utilityTheme[tokenKey] }];
        })
      )
    )
  ) as Record<string, NativeTheme['typographyUtilityLabelMedium']>;
};

export type {
  UtilityLabelProps,
  UtilityLabelSize,
  UtilityLabelWeight,
} from '../UtilityLabel.types';

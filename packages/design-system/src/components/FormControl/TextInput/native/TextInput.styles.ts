import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';
import type { TextInputSize } from '../TextInput.types';

type InputTypographyToken =
  | 'typographyUtilityTextItalicSmall'
  | 'typographyUtilityTextItalicMedium'
  | 'typographyUtilityTextItalicLarge'
  | 'typographyUtilityTextRegularSmall'
  | 'typographyUtilityTextRegularMedium'
  | 'typographyUtilityTextRegularLarge';

const INPUT_VALUE_TOKENS: Record<TextInputSize, InputTypographyToken> = {
  small: 'typographyUtilityTextRegularSmall',
  medium: 'typographyUtilityTextRegularMedium',
  large: 'typographyUtilityTextRegularLarge',
};

const INPUT_PLACEHOLDER_TOKENS: Record<TextInputSize, InputTypographyToken> = {
  small: 'typographyUtilityTextItalicSmall',
  medium: 'typographyUtilityTextItalicMedium',
  large: 'typographyUtilityTextItalicLarge',
};

type SizeStyleKey = Capitalize<TextInputSize>;

export type TextInputTypographyStyleKey =
  | `inputValue${SizeStyleKey}`
  | `inputPlaceholder${SizeStyleKey}`;

export type TextInputIconContainerStyleKey = `icon${SizeStyleKey}`;

type TextInputStyles = {
  wrapper: ViewStyle;
  input: TextStyle;
  inputDisabled: TextStyle;
  small: ViewStyle;
  medium: ViewStyle;
  large: ViewStyle;
  inputPlaceholderSmall: TextStyle;
  inputPlaceholderMedium: TextStyle;
  inputPlaceholderLarge: TextStyle;
  inputValueSmall: TextStyle;
  inputValueMedium: TextStyle;
  inputValueLarge: TextStyle;
  focused: ViewStyle;
  error: ViewStyle;
  success: ViewStyle;
  disabled: ViewStyle;
  rounded: ViewStyle;
  filled: ViewStyle;
  iconStart: ViewStyle;
  iconEnd: ViewStyle;
  iconSmall: ViewStyle;
  iconMedium: ViewStyle;
  iconLarge: ViewStyle;
  successIndicator: ViewStyle;
  successIndicatorStem: ViewStyle;
  successIndicatorKick: ViewStyle;
};

const SIZE_SUFFIX: Record<TextInputSize, SizeStyleKey> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

const ICON_SIZE: Record<TextInputSize, number> = {
  small: 20,
  medium: 24,
  large: 24,
};

export const getInputTypographyStyleKey = (
  size: TextInputSize,
  isFilled: boolean
): TextInputTypographyStyleKey =>
  `${isFilled ? 'inputValue' : 'inputPlaceholder'}${SIZE_SUFFIX[size]}`;

export const getIconContainerStyleKey = (size: TextInputSize): TextInputIconContainerStyleKey =>
  `icon${SIZE_SUFFIX[size]}`;

export const getIconPixelSize = (size: TextInputSize) => ICON_SIZE[size];

export const createStyles = (theme: NativeTheme) => {
  const typographyTheme = theme as NativeTheme & Record<InputTypographyToken, TextStyle>;

  return StyleSheet.create<TextInputStyles>({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colorBorderOnLightSubtle01,
      backgroundColor: theme.colorBackgroundLightDefault,
      borderRadius: theme.radius4,
    },
    input: {
      flex: 1,
      minWidth: 0,
      color: theme.colorTextOnLightPrimary,
      paddingVertical: 0,
      backgroundColor: 'transparent',
    },
    inputDisabled: {
      color: theme.colorTextStateDisabledOnLight,
    },
    small: {
      minHeight: theme.spacingInputSm,
      paddingHorizontal: theme.spacing8,
    },
    medium: {
      minHeight: theme.spacingInputMd,
      paddingHorizontal: theme.spacing12,
    },
    large: {
      minHeight: theme.spacingInputLg,
      paddingHorizontal: theme.spacing16,
    },
    inputPlaceholderSmall: {
      ...typographyTheme[INPUT_PLACEHOLDER_TOKENS.small],
      color: theme.colorTextOnLightSecondary,
    },
    inputPlaceholderMedium: {
      ...typographyTheme[INPUT_PLACEHOLDER_TOKENS.medium],
      color: theme.colorTextOnLightSecondary,
    },
    inputPlaceholderLarge: {
      ...typographyTheme[INPUT_PLACEHOLDER_TOKENS.large],
      color: theme.colorTextOnLightSecondary,
    },
    inputValueSmall: {
      ...typographyTheme[INPUT_VALUE_TOKENS.small],
      color: theme.colorTextOnLightPrimary,
    },
    inputValueMedium: {
      ...typographyTheme[INPUT_VALUE_TOKENS.medium],
      color: theme.colorTextOnLightPrimary,
    },
    inputValueLarge: {
      ...typographyTheme[INPUT_VALUE_TOKENS.large],
      color: theme.colorTextOnLightPrimary,
    },
    focused: {
      borderColor: theme.colorBorderStateFocus,
      shadowColor: theme.colorBorderStateFocus,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: theme.radius4,
      elevation: 1,
    },
    error: {
      borderColor: theme.colorBorderStateAttentionOnLight,
    },
    success: {
      borderColor: theme.colorBorderStateSuccessOnLight,
    },
    disabled: {
      borderColor: theme.colorBorderStateDisabledOnLight,
      backgroundColor: theme.colorBackgroundLightGray01,
    },
    rounded: {
      borderRadius: theme.radiusFull,
    },
    filled: {
      backgroundColor: theme.colorBackgroundLightGray01,
    },
    iconStart: {
      marginRight: theme.spacing8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconEnd: {
      marginLeft: theme.spacing8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconSmall: {
      width: theme.spacing20,
      height: theme.spacing20,
    },
    iconMedium: {
      width: theme.spacing24,
      height: theme.spacing24,
    },
    iconLarge: {
      width: theme.spacing24,
      height: theme.spacing24,
    },
    successIndicator: {
      width: theme.spacing20,
      height: theme.spacing20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    successIndicatorStem: {
      position: 'absolute',
      width: 2,
      height: 8,
      backgroundColor: theme.colorBorderStateSuccessOnLight,
      borderRadius: theme.radiusFull,
      transform: [{ rotate: '45deg' }, { translateX: -2 }, { translateY: 2 }],
    },
    successIndicatorKick: {
      position: 'absolute',
      width: 2,
      height: 14,
      backgroundColor: theme.colorBorderStateSuccessOnLight,
      borderRadius: theme.radiusFull,
      transform: [{ rotate: '-45deg' }, { translateX: 2 }, { translateY: 0 }],
    },
  });
};

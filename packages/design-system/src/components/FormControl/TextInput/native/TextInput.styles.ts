import { ColorValue, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
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

export type TextInputRoundedStyleKey = `rounded${SizeStyleKey}`;

type IconStyle = {
  color?: ColorValue;
};

type TextInputStyles = {
  wrapper: ViewStyle;
  input: TextStyle;
  inputDisabled: TextStyle;
  small: ViewStyle;
  medium: ViewStyle;
  large: ViewStyle;
  roundedSmall: ViewStyle;
  roundedMedium: ViewStyle;
  roundedLarge: ViewStyle;
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
  iconSuccess: IconStyle;
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

export const getRoundedStyleKey = (size: TextInputSize): TextInputRoundedStyleKey =>
  `rounded${SIZE_SUFFIX[size]}`;

export const getIconPixelSize = (size: TextInputSize) => ICON_SIZE[size];

export const getPlaceholderTextColor = (theme: NativeTheme) => theme.colorTextStateDisabledOnLight;

export const createStyles = (theme: NativeTheme) => {
  const typographyTheme = theme as NativeTheme & Record<InputTypographyToken, TextStyle>;

  return StyleSheet.create<TextInputStyles>({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colorBorderOnLightSubtle02,
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
      paddingVertical: theme.spacing8,
      paddingHorizontal: theme.spacing12,
    },
    medium: {
      minHeight: theme.spacingInputMd,
      paddingVertical: theme.spacing12,
      paddingHorizontal: theme.spacing16,
    },
    large: {
      minHeight: theme.spacingInputLg,
      paddingVertical: theme.spacing12,
      paddingHorizontal: theme.spacing16,
    },
    roundedSmall: {
      paddingVertical: theme.spacing8,
      paddingHorizontal: theme.spacing12,
    },
    roundedMedium: {
      paddingVertical: theme.spacing12,
      paddingHorizontal: theme.spacing20,
    },
    roundedLarge: {
      paddingVertical: theme.spacing12,
      paddingHorizontal: theme.spacing24,
    },
    inputPlaceholderSmall: {
      ...typographyTheme[INPUT_PLACEHOLDER_TOKENS.small],
    },
    inputPlaceholderMedium: {
      ...typographyTheme[INPUT_PLACEHOLDER_TOKENS.medium],
    },
    inputPlaceholderLarge: {
      ...typographyTheme[INPUT_PLACEHOLDER_TOKENS.large],
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconEnd: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconSuccess: {
      color: theme.colorBorderBrand01,
    },
  });
};

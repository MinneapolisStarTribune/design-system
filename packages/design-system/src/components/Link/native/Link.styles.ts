import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';

type LinkStyles = {
  row: ViewStyle;
  text: TextStyle;
  textDisabled: TextStyle;
  inlineText: TextStyle;
  inlineTextDisabled: TextStyle;
  icon: ViewStyle;
  disabled: ViewStyle;
  pressed: ViewStyle;
};

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create<LinkStyles>({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
    },

    text: {
      color: theme.colorTextOnLightPrimary,
    },

    textDisabled: {
      color: theme.colorTextOnLightPrimary,
    },

    inlineText: {
      color: theme.colorLinkTextDefault,
      textDecorationLine: 'underline',
      textDecorationColor: theme.colorLinkUnderlineDefault,
    },

    inlineTextDisabled: {
      color: theme.colorTextOnLightPrimary,
      textDecorationLine: 'none',
    },

    icon: {
      width: theme.spacing14,
      height: theme.spacing14,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: theme.spacing2,
    },

    disabled: {
      opacity: 0.4,
    },

    pressed: {
      outlineWidth: 1,
      outlineStyle: 'solid',
      outlineColor: theme.colorTextOnLightPrimary,
      outlineOffset: 1,
    },
  });

import { StyleSheet, type ViewStyle } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';

type Styles = {
  root: ViewStyle;
  option: ViewStyle;
  lastOption: ViewStyle;
};

export function createStyles(theme: NativeTheme): Styles {
  return StyleSheet.create({
    root: {
      flexDirection: 'column',
    },

    option: {
      marginBottom: theme.spacing12,
    },

    lastOption: {
      marginBottom: 0,
    },
  });
}

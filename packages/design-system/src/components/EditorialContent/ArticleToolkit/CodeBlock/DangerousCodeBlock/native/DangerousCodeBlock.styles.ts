import { StyleSheet, type ViewStyle } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';

type Styles = {
  base: ViewStyle;
  variantStandard: ViewStyle;
  variantImmersive: ViewStyle;
};

const STANDARD_MAX_WIDTH = 390;

export const createStyles = (_theme: NativeTheme) =>
  StyleSheet.create<Styles>({
    base: {
      position: 'relative',
    },
    variantStandard: {
      maxWidth: STANDARD_MAX_WIDTH,
    },
    variantImmersive: {
      width: '100%',
      maxWidth: undefined,
    },
  });

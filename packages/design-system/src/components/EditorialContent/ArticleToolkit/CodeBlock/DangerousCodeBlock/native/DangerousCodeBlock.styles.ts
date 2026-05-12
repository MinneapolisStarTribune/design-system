import { StyleSheet, type ViewStyle } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';

type Styles = {
  base: ViewStyle;
  variantStandard: ViewStyle;
  variantImmersive: ViewStyle;
};

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create<Styles>({
    base: {
      position: 'relative',
    },
    variantStandard: {
      maxWidth: theme.semanticArticleToolkitMaxWidthStandardFullMobile,
    },
    variantImmersive: {
      width: '100%',
      maxWidth: undefined,
    },
  });

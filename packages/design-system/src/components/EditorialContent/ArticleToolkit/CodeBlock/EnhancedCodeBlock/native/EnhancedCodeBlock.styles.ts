import { StyleSheet, type ViewStyle } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';
import type { CodeBlockSizeType } from '../../../types';

type VariantSizeStyles = Record<
  `variant-${'standard' | 'immersive'}-size-${CodeBlockSizeType}`,
  ViewStyle
>;

type Styles = {
  container: ViewStyle;
} & VariantSizeStyles;

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create<Styles>({
    container: {},
    'variant-standard-size-full': {
      maxWidth: theme.semanticArticleToolkitMaxWidthStandardFullMobile,
    },
    'variant-standard-size-large': {
      maxWidth: theme.semanticArticleToolkitMaxWidthStandardFullMobile,
    },
    'variant-standard-size-medium': {
      maxWidth: theme.semanticArticleToolkitMaxWidthStandardFullMobile,
    },
    'variant-standard-size-inline': {
      maxWidth: theme.semanticArticleToolkitMaxWidthStandardInlineMobile,
    },
    'variant-immersive-size-full': { width: '100%', maxWidth: undefined },
    'variant-immersive-size-large': {
      maxWidth: theme.semanticArticleToolkitMaxWidthImmersiveLargeMobile,
    },
    'variant-immersive-size-medium': {
      maxWidth: theme.semanticArticleToolkitMaxWidthImmersiveMediumMobile,
    },
    'variant-immersive-size-inline': {
      maxWidth: theme.semanticArticleToolkitMaxWidthImmersiveInlineMobile,
    },
  });

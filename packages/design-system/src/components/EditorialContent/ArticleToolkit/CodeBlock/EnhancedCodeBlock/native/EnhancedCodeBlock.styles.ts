import { StyleSheet, type ViewStyle } from 'react-native';
import type { NativeTheme } from '@/index.native';
import type { CodeBlockSizeType } from '../../../types';

type VariantSizeStyles = Record<
  `variant-${'standard' | 'immersive'}-size-${CodeBlockSizeType}`,
  ViewStyle
>;

type Styles = {
  container: ViewStyle;
} & VariantSizeStyles;

const STANDARD_MOBILE = 390;
const INLINE_MOBILE = 358;

export const createStyles = (_theme: NativeTheme) =>
  StyleSheet.create<Styles>({
    container: {},
    'variant-standard-size-full': { maxWidth: STANDARD_MOBILE },
    'variant-standard-size-large': { maxWidth: STANDARD_MOBILE },
    'variant-standard-size-medium': { maxWidth: STANDARD_MOBILE },
    'variant-standard-size-inline': { maxWidth: INLINE_MOBILE },
    'variant-immersive-size-full': { width: '100%', maxWidth: undefined },
    'variant-immersive-size-large': { maxWidth: STANDARD_MOBILE },
    'variant-immersive-size-medium': { maxWidth: STANDARD_MOBILE },
    'variant-immersive-size-inline': { maxWidth: INLINE_MOBILE },
  });

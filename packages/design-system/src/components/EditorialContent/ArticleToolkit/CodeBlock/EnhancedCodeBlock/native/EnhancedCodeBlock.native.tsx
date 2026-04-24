import React from 'react';
import { View } from 'react-native';
import type { EnhancedCodeBlockProps } from '../EnhancedCodeBlock.types';
import type { NativeViewStylingProps } from '@/types/native-base-props';

export type EnhancedCodeBlockNativeProps = NativeViewStylingProps<EnhancedCodeBlockProps>;

// TODO: Implement native EnhancedCodeBlock component
export const EnhancedCodeBlock: React.FC<EnhancedCodeBlockNativeProps> = () => {
  return <View />;
};

EnhancedCodeBlock.displayName = 'EnhancedCodeBlock';

export type { EnhancedCodeBlockNativeProps as EnhancedCodeBlockProps };

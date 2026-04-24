import React from 'react';
import { View } from 'react-native';
import type { DangerousCodeBlockProps } from '../DangerousCodeBlock.types';
import type { NativeViewStylingProps } from '@/types/native-base-props';

export type DangerousCodeBlockNativeProps = NativeViewStylingProps<DangerousCodeBlockProps>;

export const DangerousCodeBlock: React.FC<DangerousCodeBlockNativeProps> = () => {
  return <View />;
};

DangerousCodeBlock.displayName = 'DangerousCodeBlock';

export type { DangerousCodeBlockNativeProps as DangerousCodeBlockProps };

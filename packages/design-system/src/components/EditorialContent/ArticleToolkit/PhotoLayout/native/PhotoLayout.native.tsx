import React from 'react';
import { View } from 'react-native';
import type { PhotoLayoutProps } from '../PhotoLayout.types';
import type { NativeViewStylingProps } from '@/types/native-base-props';

export type PhotoLayoutNativeProps = NativeViewStylingProps<PhotoLayoutProps>;

/**
 * Placeholder for native PhotoLayout component (SUS-263).
 */
export const PhotoLayout: React.FC<PhotoLayoutNativeProps> = () => {
  return <View />;
};

export type { PhotoLayoutNativeProps as PhotoLayoutProps };

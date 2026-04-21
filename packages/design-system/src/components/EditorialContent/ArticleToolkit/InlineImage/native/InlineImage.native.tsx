import React from 'react';
import { View } from 'react-native';
import type { InlineImageProps } from '../InlineImage.types';
import type { NativeViewStylingProps } from '@/types/nativeBaseProps';

export type InlineImageNativeProps = NativeViewStylingProps<InlineImageProps>;

/**
 * Placeholder for native InlineImage component.
 */
export const InlineImage: React.FC<InlineImageNativeProps> = () => {
  return <View />;
};

export type { InlineImageNativeProps as InlineImageProps };

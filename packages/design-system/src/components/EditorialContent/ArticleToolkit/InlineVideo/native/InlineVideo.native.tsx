import React from 'react';
import { View } from 'react-native';
import type { InlineVideoProps } from '../InlineVideo.types';
import type { NativeViewStylingProps } from '@/types/native-base-props';

export type InlineVideoNativeProps = NativeViewStylingProps<InlineVideoProps>;

/**
 * InlineVideo — Native placeholder
 *
 * Full native implementation to be completed in a follow-up ticket.
 * Currently renders an empty View to satisfy type compatibility.
 */
export const InlineVideo: React.FC<InlineVideoNativeProps> = () => {
  return <View />;
};

InlineVideo.displayName = 'InlineVideo';

export type { InlineVideoNativeProps as InlineVideoProps };

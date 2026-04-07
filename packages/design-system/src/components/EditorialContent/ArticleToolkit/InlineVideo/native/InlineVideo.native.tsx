import React from 'react';
import { View } from 'react-native';
import type { InlineVideoProps } from '../InlineVideo.types';

/**
 * InlineVideo — Native placeholder
 *
 * Full native implementation to be completed in a follow-up ticket.
 * Currently renders an empty View to satisfy type compatibility.
 */
export const InlineVideo: React.FC<InlineVideoProps> = () => {
  return <View />;
};

InlineVideo.displayName = 'InlineVideo';

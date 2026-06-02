import React from 'react';
import { View } from 'react-native';
import type { InlineVideoNativeProps } from '../InlineVideo.types';
import { Caption } from '@/index.native';

export const InlineVideo: React.FC<InlineVideoNativeProps> = ({
  children,
  caption,
  dataTestId = 'inline-video',
  style,
  videoCredit,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}) => {
  return (
    <View
      style={style}
      testID={dataTestId}
      accessibilityLabel={ariaLabel}
      accessibilityElementsHidden={ariaHidden}
      importantForAccessibility={ariaHidden ? 'no-hide-descendants' : 'auto'}
    >
      {children}

      <Caption caption={caption} credit={videoCredit} variant="inline" dataTestId={dataTestId} />
    </View>
  );
};

InlineVideo.displayName = 'InlineVideo';

export type { InlineVideoNativeProps as InlineVideoProps };

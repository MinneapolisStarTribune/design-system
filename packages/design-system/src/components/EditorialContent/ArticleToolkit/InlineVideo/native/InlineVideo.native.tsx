import React from 'react';
import { View } from 'react-native';
import type { InlineVideoNativeProps } from '../InlineVideo.types';

export const InlineVideo: React.FC<InlineVideoNativeProps> = ({
  children,
  dataTestId = 'inline-video',
  style,
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
    </View>
  );
};

InlineVideo.displayName = 'InlineVideo';

export type { InlineVideoNativeProps as InlineVideoProps };

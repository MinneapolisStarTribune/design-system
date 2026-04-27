import React from 'react';
import { View } from 'react-native';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import type { InlineVideoNativeProps } from '../InlineVideo.types';

export const InlineVideo: React.FC<InlineVideoNativeProps> = ({
  children,
  caption,
  dataTestId = 'inline-video',
  style,
  videoCredit,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}) => {
  const captionText = [caption, videoCredit && `(${videoCredit})`].filter(Boolean).join(' ');

  return (
    <View
      style={style}
      testID={dataTestId}
      accessibilityLabel={ariaLabel}
      accessibilityElementsHidden={ariaHidden}
      importantForAccessibility={ariaHidden ? 'no-hide-descendants' : 'auto'}
    >
      {children}

      {captionText && (
        <UtilityLabel size="small" dataTestId={`${dataTestId}-caption`}>
          {captionText}
        </UtilityLabel>
      )}
    </View>
  );
};

InlineVideo.displayName = 'InlineVideo';

export type { InlineVideoNativeProps as InlineVideoProps };

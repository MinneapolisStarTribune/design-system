import React, { useMemo } from 'react';
import {
  Image as NativeImage,
  ImageProps as NativeImageProps,
  StyleProp,
  ImageStyle,
  Pressable,
  GestureResponderEvent,
} from 'react-native';

import { BaseProps } from '@/types';

export interface ImageProps
  extends Omit<NativeImageProps, 'source' | 'style'>,
    Omit<BaseProps, 'className' | 'style'> {
  src: string;
  alt?: string; // made optional
  imgixParams?: string;

  style?: StyleProp<ImageStyle>;
  onPress?: (event: GestureResponderEvent) => void;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  imgixParams,
  style,
  dataTestId = 'image',
  accessibilityLabel,
  onPress,
  ...rest
}) => {
  const finalSrc = useMemo(() => {
    if (!imgixParams) return src;

    const cleanedParams = imgixParams.startsWith('?') ? imgixParams.slice(1) : imgixParams;

    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}${cleanedParams}`;
  }, [src, imgixParams]);

  const role = onPress ? 'button' : 'image';

  const imageElement = (
    <NativeImage
      source={{ uri: finalSrc }}
      style={style}
      testID={dataTestId}
      accessible
      accessibilityRole={role}
      accessibilityLabel={accessibilityLabel || alt || undefined}
      {...rest}
    />
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole={role}
        accessibilityLabel={accessibilityLabel || alt || undefined}
        testID={`${dataTestId}-pressable`}
      >
        {imageElement}
      </Pressable>
    );
  }

  return imageElement;
};

Image.displayName = 'Image';

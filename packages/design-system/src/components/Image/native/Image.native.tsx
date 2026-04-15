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
  alt: string;
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
    return imgixParams ? `${src}?${imgixParams}` : src;
  }, [src, imgixParams]);

  const imageElement = (
    <NativeImage
      source={{ uri: finalSrc }}
      style={style}
      testID={dataTestId}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || alt}
      {...rest}
    />
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{imageElement}</Pressable>;
  }

  return imageElement;
};

Image.displayName = 'Image';

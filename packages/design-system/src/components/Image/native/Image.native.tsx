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
  alt?: string;
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
  accessible: accessibleProp,
  ...rest
}) => {
  const finalSrc = useMemo(() => {
    if (!imgixParams) return src;

    const cleanedParams = imgixParams.startsWith('?') ? imgixParams.slice(1) : imgixParams;
    const separator = src.includes('?') ? '&' : '?';

    return `${src}${separator}${cleanedParams}`;
  }, [src, imgixParams]);

  const resolvedLabel = accessibilityLabel || alt || undefined;
  const hasName = Boolean(resolvedLabel);
  const accessible = accessibleProp ?? hasName;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        testID={`${dataTestId}-pressable`}
        accessible={accessible}
        accessibilityRole="button"
        accessibilityLabel={resolvedLabel}
      >
        <NativeImage
          source={{ uri: finalSrc }}
          style={style}
          testID={dataTestId}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
          {...rest}
        />
      </Pressable>
    );
  }

  return (
    <NativeImage
      source={{ uri: finalSrc }}
      style={style}
      testID={dataTestId}
      accessible={accessible}
      accessibilityRole="image"
      accessibilityLabel={resolvedLabel}
      {...rest}
    />
  );
};

Image.displayName = 'Image';

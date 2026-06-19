import { StyleSheet } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';
import type { SkeletonSize, SkeletonVariant } from '../Skeleton.types';

export const createSkeletonStyles = (
  theme: NativeTheme,
  variant: SkeletonVariant,
  size: SkeletonSize
) => {
  const isCircle = variant === 'circle';

  const circleDimensions = {
    small: theme.spacing32,
    medium: theme.spacing40,
    large: theme.spacing48,
  }[size];

  const rectHeight = {
    small: theme.spacing12,
    medium: theme.spacing16,
    large: theme.spacing24,
  }[size];

  const rectRadius = {
    small: theme.radius2,
    medium: theme.radius4,
    large: theme.radius6,
  }[size];

  return StyleSheet.create({
    root: {
      overflow: 'hidden',
      flexShrink: 0,
      backgroundColor: theme.colorBackgroundLightGray02,
      ...(isCircle
        ? {
            width: circleDimensions,
            height: circleDimensions,
            borderRadius: theme.radiusFull,
          }
        : {
            width: '100%',
            height: rectHeight,
            borderRadius: rectRadius,
          }),
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
      backgroundColor: theme.colorBackgroundLightGray01,
      opacity: 0.8,
    },
  });
};

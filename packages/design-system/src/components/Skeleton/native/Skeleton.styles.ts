import { StyleSheet } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';
import type { SkeletonVariant } from '../Skeleton.types';

export const createSkeletonStyles = (theme: NativeTheme, variant: SkeletonVariant) => {
  const isCircle = variant === 'circle';

  return StyleSheet.create({
    root: {
      overflow: 'hidden',
      flexShrink: 0,
      backgroundColor: theme.colorNeutral200,
      ...(isCircle
        ? {
            width: theme.spacing64,
            height: theme.spacing64,
            borderRadius: theme.radiusFull,
          }
        : {
            width: 200,
            height: 25,
            borderRadius: theme.radius4,
          }),
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
      backgroundColor: theme.colorNeutral100,
      opacity: 0.8,
    },
  });
};

import { StyleSheet } from 'react-native';
import type { NativeTheme } from '@/hooks/useNativeStyles';
import type { SkeletonSurface, SkeletonVariant } from '../Skeleton.types';

export const createSkeletonStyles = (
  theme: NativeTheme,
  variant: SkeletonVariant,
  surface?: SkeletonSurface
) => {
  // light and dark are fixed. With no surface, colors follow the theme.
  const palettes = {
    light: { from: theme.colorNeutral200, to: theme.colorNeutral100 },
    dark: { from: theme.colorBackgroundDarkGray02, to: theme.colorBackgroundDarkGray01 },
  };
  const { from, to } = (surface && palettes[surface]) ?? {
    from: theme.colorBackgroundLightGray02,
    to: theme.colorBackgroundLightGray01,
  };
  const isCircle = variant === 'circle';

  return StyleSheet.create({
    root: {
      overflow: 'hidden',
      flexShrink: 0,
      backgroundColor: from,
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
      backgroundColor: to,
      opacity: 0.8,
    },
  });
};

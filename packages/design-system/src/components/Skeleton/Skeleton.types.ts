import type { HTMLAttributes } from 'react';
import type { AccessibilityProps, BaseProps } from '@/types';
import type { NativeViewStylingProps } from '@/types/native-base-props';

export const SKELETON_VARIANTS = ['circle', 'rectangle'] as const;
export type SkeletonVariant = (typeof SKELETON_VARIANTS)[number];

export const SKELETON_VARIANT_DEFAULTS = {
  rectangle: { width: 200, height: 25 },
  circle: { width: 64, height: 64 },
} as const satisfies Record<SkeletonVariant, { width: number; height: number }>;

/** Shared props for web and native Skeleton. */
export type SkeletonBaseProps = AccessibilityProps &
  Pick<BaseProps, 'dataTestId'> & {
    /** Shape of the placeholder. Defaults to `rectangle`. */
    variant?: SkeletonVariant;
    /** When true (default), runs the shimmer animation. Set false when a parent handles animation. */
    animate?: boolean;
    /**
     * Rectangle defaults to 200px × 25px. Circle defaults to a 64px diameter.
     * For circles, setting `width` or `height` sets the diameter — the other axis matches.
     */
    width?: number | string;
    /**
     * Rectangle defaults to 25px. Circle defaults to 64px.
     * For circles, only used when `width` is not set; both axes use the same value.
     */
    height?: number | string;
  };

export type SkeletonProps = SkeletonBaseProps &
  Pick<BaseProps, 'className' | 'style'> &
  Omit<HTMLAttributes<HTMLDivElement>, keyof SkeletonBaseProps | keyof BaseProps>;

export type SkeletonNativeProps = NativeViewStylingProps<SkeletonBaseProps>;

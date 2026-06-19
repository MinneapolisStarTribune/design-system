import type { HTMLAttributes } from 'react';
import type { AccessibilityProps, BaseProps } from '@/types';
import type { NativeViewStylingProps } from '@/types/native-base-props';

export const SKELETON_VARIANTS = ['circle', 'rectangle'] as const;
export type SkeletonVariant = (typeof SKELETON_VARIANTS)[number];

export const SKELETON_SIZES = ['small', 'medium', 'large'] as const;
export type SkeletonSize = (typeof SKELETON_SIZES)[number];

export const SKELETON_BACKGROUNDS = ['light', 'dark'] as const;
export type SkeletonBackground = (typeof SKELETON_BACKGROUNDS)[number];

/** Shared props for web and native Skeleton. */
export type SkeletonBaseProps = AccessibilityProps &
  Pick<BaseProps, 'dataTestId'> & {
    /** Shape of the placeholder. Defaults to `rectangle`. */
    variant?: SkeletonVariant;
    /** Height (rectangle) or diameter (circle). Defaults to `medium`. */
    size?: SkeletonSize;
    /**
     * Fill palette for light or dark surfaces. Defaults to `light`.
     * Use `dark` when the skeleton sits on a dark region while the page still uses light theme CSS on `:root`.
     */
    background?: SkeletonBackground;
    /** When true (default), runs the pulse animation. Set false when a parent handles animation. */
    animate?: boolean;
    /** Override default width. Rectangle defaults to 100% of parent; circle uses the size token. */
    width?: number | string;
    /** Override default height. Rectangle uses the size token; circle uses the size token. */
    height?: number | string;
  };

export type SkeletonProps = SkeletonBaseProps &
  Pick<BaseProps, 'className' | 'style'> &
  Omit<HTMLAttributes<HTMLDivElement>, keyof SkeletonBaseProps | keyof BaseProps>;

export type SkeletonNativeProps = NativeViewStylingProps<SkeletonBaseProps>;

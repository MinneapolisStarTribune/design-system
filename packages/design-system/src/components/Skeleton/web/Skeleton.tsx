'use client';

import classNames from 'classnames';
import {
  SKELETON_BACKGROUNDS,
  SKELETON_SIZES,
  SKELETON_VARIANTS,
  type SkeletonBackground,
  type SkeletonProps,
  type SkeletonSize,
  type SkeletonVariant,
} from '@/components/Skeleton/Skeleton.types';
import styles from './Skeleton.module.scss';

export {
  SKELETON_BACKGROUNDS,
  SKELETON_SIZES,
  SKELETON_VARIANTS,
  type SkeletonBackground,
  type SkeletonProps,
  type SkeletonSize,
  type SkeletonVariant,
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangle',
  size = 'medium',
  animate = true,
  width,
  height,
  className,
  style,
  dataTestId,
  'aria-hidden': ariaHidden = true,
  ...rest
}) => {
  const dimensionStyle =
    width !== undefined || height !== undefined
      ? {
          ...(width !== undefined ? { width } : null),
          ...(height !== undefined ? { height } : null),
        }
      : undefined;

  return (
    <div
      className={classNames(
        styles.skeleton,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        animate && styles.animate,
        className
      )}
      style={dimensionStyle ? { ...dimensionStyle, ...style } : style}
      aria-hidden={ariaHidden}
      data-testid={dataTestId}
      {...rest}
    />
  );
};

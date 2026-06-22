'use client';

import classNames from 'classnames';
import {
  SKELETON_VARIANTS,
  type SkeletonProps,
  type SkeletonVariant,
} from '@/components/Skeleton/Skeleton.types';
import { resolveSkeletonDimensions } from '@/components/Skeleton/resolveSkeletonDimensions';
import styles from './Skeleton.module.scss';

export { SKELETON_VARIANTS, type SkeletonProps, type SkeletonVariant };

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangle',
  animate = true,
  width,
  height,
  className,
  style,
  dataTestId,
  'aria-hidden': ariaHidden = true,
  ...rest
}) => {
  const dimensionStyle = resolveSkeletonDimensions(variant, width, height);
  const hasDimensionStyle =
    dimensionStyle.width !== undefined || dimensionStyle.height !== undefined;

  return (
    <div
      className={classNames(
        styles.skeleton,
        styles[`variant-${variant}`],
        animate && styles.animate,
        className
      )}
      style={hasDimensionStyle ? { ...dimensionStyle, ...style } : style}
      aria-hidden={ariaHidden}
      data-testid={dataTestId}
      {...rest}
    />
  );
};

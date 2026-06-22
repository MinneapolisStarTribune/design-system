'use client';

import classNames from 'classnames';
import {
  SKELETON_VARIANTS,
  type SkeletonProps,
  type SkeletonVariant,
} from '@/components/Skeleton/Skeleton.types';
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

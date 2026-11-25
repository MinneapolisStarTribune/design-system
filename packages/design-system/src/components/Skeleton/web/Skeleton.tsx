'use client';

import classNames from 'classnames';
import {
  SKELETON_VARIANTS,
  type SkeletonProps,
  type SkeletonSurface,
  type SkeletonVariant,
} from '@/components/Skeleton/Skeleton.types';
import { resolveSkeletonDimensions } from '@/components/Skeleton/resolveSkeletonDimensions';
import styles from './Skeleton.module.scss';

export { SKELETON_VARIANTS, type SkeletonProps, type SkeletonSurface, type SkeletonVariant };

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangle',
  surface,
  animate = true,
  width,
  height,
  radius,
  className,
  style,
  dataTestId,
  'aria-hidden': ariaHidden = true,
  ...rest
}) => {
  const dimensionStyle = resolveSkeletonDimensions(variant, width, height);
  const inlineStyle = {
    ...dimensionStyle,
    ...(radius !== undefined ? { borderRadius: radius } : {}),
    ...style,
  };

  return (
    <div
      className={classNames(
        styles.skeleton,
        styles[`variant-${variant}`],
        surface && styles[`surface-${surface}`],
        animate && styles.animate,
        className
      )}
      style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}
      aria-hidden={ariaHidden}
      data-testid={dataTestId}
      {...rest}
    />
  );
};

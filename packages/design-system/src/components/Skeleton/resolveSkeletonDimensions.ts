import type { SkeletonVariant } from './Skeleton.types';

const isProvidedDimension = (value: number | string | undefined): value is number | string =>
  value !== undefined && value !== null && value !== '' && value !== 0;

/** Applies width/height overrides. Circle always keeps a 1:1 aspect ratio. */
export const resolveSkeletonDimensions = (
  variant: SkeletonVariant,
  width?: number | string,
  height?: number | string
): { width?: number | string; height?: number | string } => {
  const hasWidth = isProvidedDimension(width);
  const hasHeight = isProvidedDimension(height);

  if (variant === 'circle') {
    if (!hasWidth && !hasHeight) {
      return {};
    }

    const diameter = hasWidth ? width : height;
    return { width: diameter, height: diameter };
  }

  if (!hasWidth && !hasHeight) {
    return {};
  }

  return {
    ...(hasWidth ? { width } : {}),
    ...(hasHeight ? { height } : {}),
  };
};

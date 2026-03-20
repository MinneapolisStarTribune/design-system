import { BaseProps } from '@/types';
import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export interface ImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    Omit<BaseProps, 'className'> {
  src: string;
  alt: string;
  imgixParams?: string;
  /** Per-image tracking data merged into the click event. Use when image is clickable (e.g. module_name, image_context). */
  analytics?: Record<string, unknown>;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  imgixParams,
  dataTestId = 'image',
  onClick,
  analytics: analyticsOverride,
  ...rest
}) => {
  const { track } = useAnalytics();
  const finalSrc = imgixParams ? `${src}?${imgixParams}` : src;

  const handleClick = onClick
    ? (e: React.MouseEvent<HTMLImageElement>) => {
        track({
          event: 'image_click',
          component: 'Image',
          alt,
          ...analyticsOverride,
        });
        onClick(e);
      }
    : undefined;

  return (
    <img
      src={finalSrc}
      alt={alt}
      data-testid={dataTestId}
      onClick={handleClick}
      {...rest}
    />
  );
};

Image.displayName = 'Image';

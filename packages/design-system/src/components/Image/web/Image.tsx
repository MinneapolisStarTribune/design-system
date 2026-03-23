import { BaseProps } from '@/types';
import React from 'react';

export interface ImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    Omit<BaseProps, 'className'> {
  src: string;
  alt: string;
  imgixParams?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  imgixParams,
  dataTestId = 'image',
  onClick,
  ...rest
}) => {
  const finalSrc = imgixParams ? `${src}?${imgixParams}` : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      data-testid={dataTestId}
      onClick={onClick}
      {...rest}
    />
  );
};

Image.displayName = 'Image';

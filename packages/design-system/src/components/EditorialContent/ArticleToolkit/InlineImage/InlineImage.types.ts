import type { ArticleToolkitMediaProps, ImageData, InlineImageSizeType } from '../types';

export interface InlineImageProps extends Omit<ArticleToolkitMediaProps, 'altText'> {
  expandable?: boolean;
  image: ImageData;
  size?: InlineImageSizeType;
  imgixParams?: string;
  objectFit?: 'cover' | 'contain';
  purchaseLink?: string;
}

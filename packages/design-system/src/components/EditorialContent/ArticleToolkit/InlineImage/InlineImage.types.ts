import type { ArticleToolkitMediaProps, ImageData } from '../types';

export interface InlineImageProps extends Omit<ArticleToolkitMediaProps, 'altText'> {
  expandable?: boolean;
  image: ImageData;
  imgixParams?: string;
  objectFit?: 'cover' | 'contain';
  purchaseLink?: string;
}

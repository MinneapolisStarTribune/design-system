import type { ArticleToolkitMediaProps, ImageData } from '../types';

export interface InlineImageProps extends Omit<ArticleToolkitMediaProps, 'altText'> {
  expandable?: boolean;
  imageList: ImageData[];
  imgixParams?: string;
  objectFit?: 'cover' | 'contain';
  purchaseLink?: string;
}

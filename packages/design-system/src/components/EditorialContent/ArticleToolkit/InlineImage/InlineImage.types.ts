import type { ArticleToolkitMediaProps, ImageData, InlineImageSizeType } from '../types';

export interface InlineImageProps extends ArticleToolkitMediaProps {
  expandable?: boolean;
  image: ImageData;
  size?: InlineImageSizeType;
  imgixParams?: string;
  objectFit?: 'cover' | 'contain';
}

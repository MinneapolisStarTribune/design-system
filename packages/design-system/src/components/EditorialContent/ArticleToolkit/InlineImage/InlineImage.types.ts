import type { ArticleToolkitMediaProps, ImageData } from '../types';
import type { CtaLinkProps } from '@/types/globalTypes';

export interface InlineImageProps extends Omit<ArticleToolkitMediaProps, 'altText'> {
  expandable?: boolean;
  image: ImageData;
  /** Optional Buy Reprint CTA shown with inline and expanded caption contexts. */
  purchaseLink?: CtaLinkProps;
  imgixParams?: string;
  objectFit?: 'cover' | 'contain';
}

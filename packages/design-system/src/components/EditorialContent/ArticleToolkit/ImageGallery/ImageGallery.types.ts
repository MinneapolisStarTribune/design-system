import { ImageProps } from '@/index.web';
import { AccessibilityProps, BaseProps } from '@/types';

export type Variant = 'standard' | 'immersive';

export interface ImageItem {
  src: string;
  altText: string;
  caption?: string;
  credit?: string;
  width?: number;
  height?: number;
  imgixParams?: string;
}

export interface ImageGalleryProps extends BaseProps, AccessibilityProps {
  images: ImageItem[];
  variant?: Variant;
  ImageComponent?: React.ComponentType<ImageProps>;
  className?: string;
  imageClassName?: string;
  wrapperClassName?: string;
  captionClassName?: string;
  controlsClassName?: string;
}

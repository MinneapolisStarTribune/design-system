import { AccessibilityProps, BaseProps, CtaLinkProps } from '@/types';
import { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type Variant = 'standard' | 'immersive';

export interface ImageItem {
  altText: string;
  caption?: string;
  credit?: string;
  height?: number;
  imgixParams?: string;
  /** Optional Buy Reprint CTA shown only in the expanded lightbox view. */
  purchaseLink?: CtaLinkProps;
  src: string;
  width?: number;
}

export interface ImageGalleryBaseProps<TImageProps> extends BaseProps, AccessibilityProps {
  images: ImageItem[];
  /** When true, opens the active slide in a full-screen dialog (same pattern as InlineImage). */
  expandable?: boolean;
  variant?: Variant;
  loop?: boolean;
  ImageComponent?: React.ComponentType<TImageProps>;
}

export interface ImageGalleryProps<TImageProps> extends ImageGalleryBaseProps<TImageProps> {
  imageClassName?: string;
  wrapperClassName?: string;
  captionClassName?: string;
  controlsClassName?: string;
}
export interface ImageGalleryNativeProps<TImageProps> extends ImageGalleryBaseProps<TImageProps> {
  imageStyle?: StyleProp<ImageStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  captionStyle?: StyleProp<TextStyle>;
  controlsStyle?: StyleProp<ViewStyle>;
}

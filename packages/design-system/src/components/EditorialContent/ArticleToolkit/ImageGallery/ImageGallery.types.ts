import { AccessibilityProps, BaseProps, CtaLinkProps } from '@/types';
import { StyleProp, ViewStyle, ImageStyle } from 'react-native';

export type Variant = 'standard' | 'immersive';

export interface ImageItem {
  altText: string;
  caption?: string;
  credit?: string;
  height?: number;
  imgixParams?: string;
  /** Optional Buy Reprint CTA for this image item. */
  purchaseLink?: CtaLinkProps;
  src: string;
  width?: number;
}

export interface ImageGalleryBaseProps<TImageProps> extends BaseProps, AccessibilityProps {
  images: ImageItem[];
  /** When true, opens the active slide in a full-screen dialog (same pattern as InlineImage). */
  expandable?: boolean;
  purchaseLink?: CtaLinkProps;
  /** Applies one consistent wrapper aspect ratio across the gallery, e.g. '1 / 1' or '3 / 2'. */
  aspectRatio?: string;
  /** Optional explicit spacing (px) between slides; useful for consumer-defined immersive spacing logic. */
  spaceBetween?: number;
  /** Called with 1-based active slide index on mount and whenever the active slide changes. */
  onIndexChange?: (index: number) => void;
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
  captionStyle?: StyleProp<ViewStyle>;
  controlsStyle?: StyleProp<ViewStyle>;
}

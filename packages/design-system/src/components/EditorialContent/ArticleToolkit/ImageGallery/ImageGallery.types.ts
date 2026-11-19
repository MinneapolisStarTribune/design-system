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
  /**
   * Called with the 1-based active slide index.
   * Web: on mount and whenever the active slide changes.
   * Native: when the carousel lands on a new image after a swipe or a previous/next tap; not called on mount or when `initialIndex` moves the carousel.
   */
  onIndexChange?: (index: number) => void;
  /**
   * Native only; web ignores it. 0-based index to scroll to on mount and whenever the value changes.
   * Leaving it undefined never moves the carousel. Note `onIndexChange` reports a 1-based index.
   */
  initialIndex?: number;
  variant?: Variant;
  loop?: boolean;
  ImageComponent?: React.ComponentType<TImageProps>;
}

export interface ImageGalleryProps<TImageProps> extends ImageGalleryBaseProps<TImageProps> {
  imageClassName?: string;
  wrapperClassName?: string;
  captionClassName?: string;
  controlsClassName?: string;
  /** Applied to the previous/next navigation buttons, in both the inline caption and the expanded dialog. */
  navButtonClassName?: string;
  /** Applied to each slide's expand-to-dialog button (only rendered when `expandable` is true). */
  expandButtonClassName?: string;
  /** Applied to the expanded dialog's close button (only rendered when `expandable` is true). */
  closeButtonClassName?: string;
}
export interface ImageGalleryNativeProps<TImageProps> extends ImageGalleryBaseProps<TImageProps> {
  imageStyle?: StyleProp<ImageStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  captionStyle?: StyleProp<ViewStyle>;
  controlsStyle?: StyleProp<ViewStyle>;
}

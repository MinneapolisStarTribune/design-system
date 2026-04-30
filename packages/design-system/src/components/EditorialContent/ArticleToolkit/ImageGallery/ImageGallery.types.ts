import { AccessibilityProps, BaseProps } from '@/types';
import { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

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

export interface ImageGalleryProps<TImageProps> extends BaseProps, AccessibilityProps {
  images: ImageItem[];
  variant?: Variant;
  loop?: boolean;

  ImageComponent?: React.ComponentType<TImageProps>;

  imageClassName?: string;
  wrapperClassName?: string;
  captionClassName?: string;
  controlsClassName?: string;

  imageStyle?: StyleProp<ImageStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  captionStyle?: StyleProp<TextStyle>;
  controlsStyle?: StyleProp<ViewStyle>;
}

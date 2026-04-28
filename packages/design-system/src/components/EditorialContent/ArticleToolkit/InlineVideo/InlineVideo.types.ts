import type { ArticleToolkitBaseProps, InlineVideoOrientationType } from '../types';
import type { NativeViewStylingProps } from '@/types/native-base-props';

/** Shared props for web and native InlineVideo. */
export interface InlineVideoBaseProps extends ArticleToolkitBaseProps {
  orientation?: InlineVideoOrientationType;
  /** Caption/description for the video. */
  caption?: string;
  /** Video credit/attribution. */
  videoCredit?: string;
  /** Optional poster/thumbnail URL. Consumer optimizes via imgix, etc. */
  posterUrl?: string;
  /**
   * Video player slot. Consumer provides JW Player, native video, etc.
   * Design system provides container styling; consumer ensures accessibility.
   */
  children?: React.ReactNode;
}

/** Web InlineVideo props. */
export type InlineVideoProps = InlineVideoBaseProps;

/** Native InlineVideo props with React Native view styling. */
export type InlineVideoNativeProps = NativeViewStylingProps<InlineVideoBaseProps>;

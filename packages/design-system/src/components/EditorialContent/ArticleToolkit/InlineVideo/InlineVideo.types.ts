import type { ArticleToolkitBaseProps, InlineVideoOrientationType } from '../types';

export interface InlineVideoProps extends ArticleToolkitBaseProps {
  orientation?: InlineVideoOrientationType;
  caption?: string;
  videoCredit?: string;
  posterUrl?: string;
  children?: React.ReactNode;
}

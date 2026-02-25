import React from 'react';
import type { ArticleToolkitBaseProps } from '../types';

export interface InlineVideoProps extends ArticleToolkitBaseProps {
  /** Placeholder - Inline Video component (SUS-156) */
}

export const InlineVideo: React.FC<InlineVideoProps> = () => {
  return <div data-testid="inline-video">InlineVideo (placeholder)</div>;
};

InlineVideo.displayName = 'InlineVideo';

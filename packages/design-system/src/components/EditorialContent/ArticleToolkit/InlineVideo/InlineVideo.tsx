import React from 'react';
import type { ArticleToolkitBaseProps } from '../types';

/** Placeholder - Inline Video component (SUS-156) */
export type InlineVideoProps = ArticleToolkitBaseProps;

export const InlineVideo: React.FC<InlineVideoProps> = () => {
  return <div data-testid="inline-video">InlineVideo (placeholder)</div>;
};

InlineVideo.displayName = 'InlineVideo';

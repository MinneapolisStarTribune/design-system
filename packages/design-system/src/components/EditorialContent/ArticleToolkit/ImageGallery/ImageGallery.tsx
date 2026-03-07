import React from 'react';
import type { ArticleToolkitBaseProps } from '../types';

export interface ImageGalleryProps extends ArticleToolkitBaseProps {
  /** Placeholder - Image Gallery component (SUS-155) */
}

export const ImageGallery: React.FC<ImageGalleryProps> = () => {
  return <div data-testid="image-gallery">ImageGallery (placeholder)</div>;
};

ImageGallery.displayName = 'ImageGallery';

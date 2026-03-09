import React from 'react';
import type { ArticleToolkitBaseProps } from '../types';

/** Placeholder - Photo Layout component (SUS-121) */
export type PhotoLayoutProps = ArticleToolkitBaseProps;

export const PhotoLayout: React.FC<PhotoLayoutProps> = () => {
  return <div data-testid="photo-layout">PhotoLayout (placeholder)</div>;
};

PhotoLayout.displayName = 'PhotoLayout';

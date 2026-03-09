import React from 'react';
import type { ArticleToolkitBaseProps } from '../types';

/** Placeholder - Social Embeds component (SUS-163) */
export type SocialEmbedsProps = ArticleToolkitBaseProps;

export const SocialEmbeds: React.FC<SocialEmbedsProps> = () => {
  return <div data-testid="social-embeds">SocialEmbeds (placeholder)</div>;
};

SocialEmbeds.displayName = 'SocialEmbeds';

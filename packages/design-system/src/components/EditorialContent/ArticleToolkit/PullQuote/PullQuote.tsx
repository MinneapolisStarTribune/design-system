import React from 'react';
import type { ArticleToolkitBaseProps } from '../types';

/** Placeholder - Pull Quote component (SUS-162) */
export type PullQuoteProps = ArticleToolkitBaseProps;

export const PullQuote: React.FC<PullQuoteProps> = () => {
  return <div data-testid="pull-quote">PullQuote (placeholder)</div>;
};

PullQuote.displayName = 'PullQuote';

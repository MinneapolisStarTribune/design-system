import React from 'react';
import type { ArticleToolkitBaseProps } from '../types';

export interface PullQuoteProps extends ArticleToolkitBaseProps {
  /** Placeholder - Pull Quote component (SUS-162) */
}

export const PullQuote: React.FC<PullQuoteProps> = () => {
  return <div data-testid="pull-quote">PullQuote (placeholder)</div>;
};

PullQuote.displayName = 'PullQuote';

import type { ArticleToolkitBaseProps, PullQuoteAlign } from '../types';

export interface PullQuoteProps extends ArticleToolkitBaseProps {
  quote: string;
  attribution?: string;
  jobTitle?: string;
  isLongQuote?: boolean;
  align?: PullQuoteAlign;
}

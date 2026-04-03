import { ArticleToolkitBaseProps } from '../types';

export type PullQuoteAlign = 'left' | 'center' | 'right';

export interface PullQuoteProps extends ArticleToolkitBaseProps {
  quote: string;
  attribution?: string;
  jobTitle?: string;
  isLongQuote?: boolean;
  align?: PullQuoteAlign;
}

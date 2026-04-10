import type { ArticleToolkitBaseProps, PullQuoteSizeType } from '../types';

export interface PullQuoteProps extends ArticleToolkitBaseProps {
  quote: string;
  attribution?: string;
  jobTitle?: string;
  size?: PullQuoteSizeType;
}

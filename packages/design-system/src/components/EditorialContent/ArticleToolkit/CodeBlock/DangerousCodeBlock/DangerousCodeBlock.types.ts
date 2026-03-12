import { ArticleToolkitBaseProps } from '../../types';

export interface DangerousCodeBlockProps extends ArticleToolkitBaseProps {
  /** Raw HTML markup from Arc CMS (charts, maps, embeds) */
  markup: string;
  /** Replace smart quotes in markup. @default true */
  cleanQuotes?: boolean;
}

import type { ArticleToolkitBaseProps } from '@/components/EditorialContent/ArticleToolkit/types';

export interface BaseDangerousCodeBlockProps extends ArticleToolkitBaseProps {
  /*
   * Raw HTML markup from Arc CMS (charts, maps, embeds)
   */
  markup: string;
  /**
   * Replace smart quotes in markup
   * @default true
   */
  cleanQuotes?: boolean;
}

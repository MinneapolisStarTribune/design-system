import type {
  ArticleToolkitBaseProps,
  CodeBlockSizeType,
} from '@/components/EditorialContent/ArticleToolkit/types';

export interface DangerousCodeBlockProps extends ArticleToolkitBaseProps {
  /*
   * Raw HTML markup from Arc CMS (charts, maps, embeds)
   */
  markup: string;
  /**
   * Replace smart quotes in markup
   * @default true
   */
  cleanQuotes?: boolean;
  /**
   * Size variant (used only when cleanQuotes is false).
   */
  size?: CodeBlockSizeType;
}

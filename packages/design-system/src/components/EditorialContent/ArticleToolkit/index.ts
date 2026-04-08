/**
 * Article Toolkit components for editorial content.
 * @see architecture/article-toolkit-variants.md
 */

export { ImageGallery, type ImageGalleryProps } from './ImageGallery/web/ImageGallery';
export { InlineVideo, type InlineVideoProps } from './InlineVideo/web/InlineVideo';
export { PhotoLayout } from './PhotoLayout/web/PhotoLayout';
export { type PhotoLayoutProps } from './PhotoLayout/PhotoLayout.types';
export { PullQuote, type PullQuoteProps } from './PullQuote/PullQuote';
export { SocialEmbeds, type SocialEmbedsProps } from './SocialEmbeds/SocialEmbeds';
export {
  ARTICLE_BODY_VARIANTS,
  type ArticleBodyVariant,
  type ArticleToolkitAuthorProps,
  type ArticleToolkitBaseProps,
  type ArticleToolkitEventHandlers,
  type ArticleToolkitMediaProps,
  type ImageData,
  type ImageUrlTransformContext,
  PHOTO_LAYOUT_TYPES,
  type PhotoLayoutType,
} from './types';
export { DangerousCodeBlock } from './CodeBlock/DangerousCodeBlock/web/DangerousCodeBlock';
export type { DangerousCodeBlockProps } from './CodeBlock/DangerousCodeBlock/DangerousCodeBlock.types';
export { EnhancedCodeBlock } from './CodeBlock/EnhancedCodeBlock/web/EnhancedCodeBlock';
export type { EnhancedCodeBlockProps } from './CodeBlock/EnhancedCodeBlock/EnhancedCodeBlock.types';

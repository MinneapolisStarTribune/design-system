/**
 * Article Toolkit components for editorial content.
 * @see architecture/article-toolkit-variants.md
 */

export { ImageGallery, type ImageGalleryProps } from './ImageGallery/web/ImageGallery';
export { InlineImage } from './InlineImage/web/InlineImage';
export type { InlineImageProps } from './InlineImage/InlineImage.types';
export { InlineVideo, type InlineVideoProps } from './InlineVideo/web/InlineVideo';
export { PhotoLayout } from './PhotoLayout/web/PhotoLayout';
export { type PhotoLayoutProps } from './PhotoLayout/PhotoLayout.types';
export { PullQuote, type PullQuoteProps } from './PullQuote/web/PullQuote';
export { SocialEmbeds } from './SocialEmbeds/web/SocialEmbeds';
export { type SocialEmbedsProps } from './SocialEmbeds/SocialEmbed.types';
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
export {
  DangerousCodeBlock,
  type DangerousCodeBlockProps,
} from './CodeBlock/DangerousCodeBlock/web/DangerousCodeBlock';
export {
  EnhancedCodeBlock,
  type EnhancedCodeBlockProps,
} from './CodeBlock/EnhancedCodeBlock/web/EnhancedCodeBlock';

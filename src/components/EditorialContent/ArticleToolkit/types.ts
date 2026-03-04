/**
 * Article Toolkit Types
 *
 * Shared type definitions for immersive template components in the design library.
 * Used across Startribune and Varsity brands.
 *
 * @see docs/immersive-component-architecture.md
 */

import type { BaseProps, AccessibilityProps } from '@/types/globalTypes';

/**
 * Layout variants for article body and article toolkit components.
 * Aligns with Arc CMS Template enum (DEFAULT, IMMERSIVE, etc.).
 */
export const ARTICLE_BODY_VARIANTS = {
  STANDARD: 'standard',
  IMMERSIVE: 'immersive',
} as const;

export type ArticleBodyVariant = (typeof ARTICLE_BODY_VARIANTS)[keyof typeof ARTICLE_BODY_VARIANTS];

/**
 * Base props for all Article Toolkit components.
 * Extends design system BaseProps and AccessibilityProps.
 */
export interface ArticleToolkitBaseProps extends BaseProps, AccessibilityProps {
  /**
   * Layout variant - determines standard vs immersive presentation.
   * @default 'standard'
   */
  variant?: ArticleBodyVariant;
}

/**
 * Common props for components that render media (images, video, galleries).
 */
export interface ArticleToolkitMediaProps extends ArticleToolkitBaseProps {
  /** Alt text for images (required for accessibility) */
  altText?: string;
  /** Caption displayed with the media */
  caption?: string;
  /** Credit/attribution for the media */
  credit?: string;
}

/**
 * Common props for components that render author/attribution content.
 */
export interface ArticleToolkitAuthorProps extends ArticleToolkitBaseProps {
  /** Author display name */
  name?: string;
  /** Author bio/description */
  bio?: string;
  /** Author image URL */
  imageUrl?: string;
}

/**
 * Event handler types for interactive article toolkit components.
 */
export interface ArticleToolkitEventHandlers {
  onClick?: React.MouseEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
}

/**
 * Image data for article media components (InLineImage, PhotoLayout, etc.)
 */
export interface ImageData {
  src: string;
  altText: string;
  width?: number;
  height?: number;
}

/**
 * Photo layout grid types: 2-up, 3-up, or 4-up
 */
export const PHOTO_LAYOUT_TYPES = ['2up', '3up', '4up'] as const;
export type PhotoLayoutType = (typeof PHOTO_LAYOUT_TYPES)[number];

/**
 * Context for image URL transformation (e.g. imgix params)
 */
export interface ImageUrlTransformContext {
  width?: number;
  aspectRatio?: string;
}

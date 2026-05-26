import type React from 'react';
import type { AccessibilityProps, BaseProps, CtaLinkProps } from '../../types';
import type { NativeViewStylingProps } from '../../types/native-base-props';

export const CAPTION_VARIANTS = ['inline', 'lightbox'] as const;

export type CaptionVariant = (typeof CAPTION_VARIANTS)[number];

/**
 * Shared caption API for web and native (editorial image/video captions).
 * Excludes platform styling (`className` / CSS `style` / RN `style`) and purchase-link click handlers.
 */
export interface CaptionBaseProps extends AccessibilityProps, Pick<BaseProps, 'dataTestId'> {
  /**
   * Editorial caption
   */
  caption?: React.ReactNode;

  /**
   * Photographer attribution
   */
  credit?: React.ReactNode;

  /**
   * Optional buy reprint CTA
   */
  purchaseLink?: CtaLinkProps;

  /**
   * UI context
   */
  variant?: CaptionVariant;

  /**
   * Functional pagination
   */
  currentIndex?: number;

  totalItems?: number;

  /**
   * Navigation handlers
   */
  onPrevious?: () => void;

  onNext?: () => void;

  /**
   * When true, keeps navigation enabled at the edges and lets the parent wrap.
   */
  loopNavigation?: boolean;

  /**
   * Analytics metadata merged into the Buy Reprint tracking event.
   */
  analytics?: Record<string, unknown>;

  onNavigationClick?: (direction: 'previous' | 'next') => void;
}

/** Web Caption — adds layout class names and anchor click handler. */
export interface CaptionProps extends CaptionBaseProps, Pick<BaseProps, 'className' | 'style'> {
  /**
   * Fired after Buy Reprint analytics when the purchase link is clicked.
   */
  onPurchaseLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/** Native Caption — RN view styling and press handler for Buy Reprint. */
export type CaptionNativeProps = NativeViewStylingProps<CaptionBaseProps> & {
  onPurchaseLinkClick?: () => void;
};

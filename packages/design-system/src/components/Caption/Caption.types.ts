import type React from 'react';
import type { AccessibilityProps, BaseProps, CtaLinkProps } from '../../types';

export const CAPTION_VARIANTS = ['inline', 'lightbox'] as const;

export type CaptionVariant = (typeof CAPTION_VARIANTS)[number];

export interface CaptionProps extends BaseProps, AccessibilityProps {
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
   * Analytics metadata merged into the Buy Reprint tracking event.
   */
  analytics?: Record<string, unknown>;

  /**
   * Analytics / external events
   */
  onPurchaseLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;

  onNavigationClick?: (direction: 'previous' | 'next') => void;
}

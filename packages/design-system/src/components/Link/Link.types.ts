import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react';
import type { BaseProps, AccessibilityProps } from '@/types/globalTypes';

export const LINK_SIZES = ['small', 'medium', 'large'] as const;
export type LinkSize = (typeof LINK_SIZES)[number];

/** Maps Link `size` to Utility Body `utility/text/medium/<token>` (class `typography-utility-text-medium-<token>`). */
export const LINK_SIZE_TO_UTILITY_BODY_TOKEN = {
  small: 'x-small',
  medium: 'small',
  large: 'medium',
} as const satisfies Record<LinkSize, string>;

export const LINK_ICON_POSITIONS = ['start', 'end'] as const;
export type LinkIconPosition = (typeof LINK_ICON_POSITIONS)[number];

export interface LinkProps
  extends BaseProps,
    AccessibilityProps,
    Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      'href' | 'children' | 'className' | 'size' | 'aria-hidden' | 'aria-label' | 'aria-describedby'
    > {
  children: string;
  size: LinkSize;
  disabled?: boolean;
  iconPosition?: LinkIconPosition;
  /**
   * Root component (default: native `a`). Pass `next/link`’s `Link` for App Router client navigation.
   * Any extra props (`prefetch`, etc.) are forwarded via `...rest` on the web `Link` component.
   */
  as?: ElementType;
  /** Navigation target. Omitted when `disabled` is true. */
  href?: string;
  className?: string;
  /** Optional icon (e.g. design-system icon); place with `iconPosition`. */
  icon?: ReactNode;
}

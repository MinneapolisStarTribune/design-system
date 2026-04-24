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

export const INLINE_LINK_BRANDS = ['startribune', 'varsity'] as const;
export type InlineLinkBrand = (typeof INLINE_LINK_BRANDS)[number];

type LinkAnchorOmit = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'children' | 'className' | 'size' | 'aria-hidden' | 'aria-label' | 'aria-describedby'
>;

/** Shared base props for utility Link across web and native implementations. */
export interface LinkBaseProps extends BaseProps, AccessibilityProps {
  children: string;
  size: LinkSize;
  icon?: ReactNode;
  iconPosition?: LinkIconPosition;
  disabled?: boolean;
}

/** Shared anchor props for both utility and inline links. */
interface LinkShared extends LinkAnchorOmit {
  /**
   * Root element or component (default: native `a`).
   * - **`a`** — standard navigation; **`href`** is applied.
   * - **`button`** — in-page control; **`href`** is omitted (invalid on `<button>`).
   * **`next/link` `Link`** (or any component that accepts **`href`**) — client navigation; pass **`prefetch`** and other props alongside **`href`**.
   */
  as?: ElementType;
  /** Navigation target. Omitted when `disabled` is true. */
  href?: string;
  disabled?: boolean;
}

export interface LinkUtilityProps extends LinkBaseProps, LinkShared {
  variant?: 'utility' | undefined;
}

/** Inline link: inherits parent typography; use via `InlineLink` or `Link variant="inline"`. */
export interface LinkInlineProps extends BaseProps, AccessibilityProps, LinkShared {
  variant: 'inline';
  brand: InlineLinkBrand;
  children: ReactNode;
  /** Ignored for inline links. */
  size?: LinkSize;
}

export type LinkProps = LinkUtilityProps | LinkInlineProps;

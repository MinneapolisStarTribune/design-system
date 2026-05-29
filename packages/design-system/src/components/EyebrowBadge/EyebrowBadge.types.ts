import type { ComponentPropsWithoutRef, ElementType } from 'react';
import type { AccessibilityProps, BaseProps } from '@/types';

export const EYEBROW_BADGE_VARIANTS = ['live', 'breaking', 'showcase', 'sponsored'] as const;
export type EyebrowBadgeVariant = (typeof EYEBROW_BADGE_VARIANTS)[number];

/** Supported static roots. Use `as={NextLink}` (or similar) with `href` for client navigation. */
export const EYEBROW_BADGE_AS_ELEMENTS = ['span', 'div', 'a'] as const;
export type EyebrowBadgeAsElement = (typeof EYEBROW_BADGE_AS_ELEMENTS)[number];

export const EYEBROW_BADGE_SIZES = ['large', 'small'] as const;
export type EyebrowBadgeSize = (typeof EYEBROW_BADGE_SIZES)[number];

/** Forwarded when `as` is a framework router link (e.g. Next.js `Link`). */
export type EyebrowBadgeRouterLinkProps = {
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

interface EyebrowBadgeSharedProps extends BaseProps, AccessibilityProps {
  label: string;
  secondaryLabel?: string;
  variant?: EyebrowBadgeVariant;
  /** Badge height / radius tokens. Defaults to `large` (24px tall, 6px radius where applicable). */
  size?: EyebrowBadgeSize;
  showDot?: boolean;
}

/**
 * Polymorphic eyebrow badge: styles apply to the root from `as`.
 * - Default: `span`
 * - `as="a"` or `as={NextLink}` — pass `href` (and optional router props)
 */
export type EyebrowBadgeProps = EyebrowBadgeSharedProps &
  EyebrowBadgeRouterLinkProps & {
    as?: ElementType;
  } & Omit<
    ComponentPropsWithoutRef<'span'>,
    keyof EyebrowBadgeSharedProps | keyof EyebrowBadgeRouterLinkProps
  > &
  Partial<
    Omit<
      ComponentPropsWithoutRef<'a'>,
      keyof EyebrowBadgeSharedProps | keyof EyebrowBadgeRouterLinkProps
    >
  > &
  Partial<
    Omit<
      ComponentPropsWithoutRef<'div'>,
      keyof EyebrowBadgeSharedProps | keyof EyebrowBadgeRouterLinkProps
    >
  >;

import type { ComponentPropsWithoutRef, ElementType, ReactElement, ReactNode } from 'react';
import type { AccessibilityProps, BaseProps } from '@/types/globalTypes';
import type { Brand } from '@/providers/theme-helpers';
import type { IconColor } from '@/components/Icon/Icon.types';

export type EyebrowLabelCustomIconProps = {
  className?: string;
  'aria-hidden'?: boolean;
};

export const EYEBROW_LABEL_SIZES = ['small', 'medium', 'large'] as const;
export type EyebrowLabelSize = (typeof EYEBROW_LABEL_SIZES)[number];

export const EYEBROW_LABEL_COLORS = ['neutral', 'brand', 'live'] as const;
export type EyebrowLabelColor = (typeof EYEBROW_LABEL_COLORS)[number];

export const EYEBROW_LABEL_BACKGROUNDS = ['on-light', 'on-dark'] as const;
export type EyebrowLabelBackground = (typeof EYEBROW_LABEL_BACKGROUNDS)[number];

/** Supported static roots. Use `as={NextLink}` (or similar) with `href` for client navigation. */
export const EYEBROW_LABEL_AS_ELEMENTS = ['span', 'label', 'a'] as const;
export type EyebrowLabelAsElement = (typeof EYEBROW_LABEL_AS_ELEMENTS)[number];

/** Forwarded when `as` is a framework router link (e.g. Next.js `Link`). */
export type EyebrowLabelRouterLinkProps = {
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

interface EyebrowLabelSharedProps extends BaseProps, AccessibilityProps {
  children?: ReactNode;
  label?: string;
  size?: EyebrowLabelSize;
  color?: EyebrowLabelColor;
  /**
   * Show the product brand mark to the left of the label.
   * Hidden when `color` is `live`, or when `isSubscriberOnly` — those states only show their indicator + text (live dot or key icon).
   * @default false
   */
  logo?: boolean;
  /** Icon color when `logo` is shown. Omit to match eyebrow text (`currentColor`). */
  logoColor?: IconColor;
  /**
   * Custom leading icon before the label.
   * Hidden when `color` is `live`, or when `isSubscriberOnly` is true.
   * This icon keeps its own default color; EyebrowLabel does not apply color styles to it.
   */
  customIcon?: ReactElement<EyebrowLabelCustomIconProps>;
  /** Subscriber-only: leading key icon instead of brand logo (`logo` has no visible brand mark). @default false */
  isSubscriberOnly?: boolean;
  /**
   * Legacy API: true maps to "on-dark", false maps to "on-light".
   * @default false
   */
  isBackground?: boolean;
  /** Preferred API for choosing contrast context. */
  background?: EyebrowLabelBackground;
  /** Uses provider brand when not supplied. */
  brand?: Brand;
  /** When `as="label"`, associates the label with a form control. */
  htmlFor?: string;
}

/**
 * Polymorphic eyebrow label: styles apply to the root from `as`.
 * - Default: `span`
 * - `as="label"` — pass `htmlFor`
 * - `as="a"` or `as={NextLink}` — pass `href` (and optional router props)
 */
export type EyebrowLabelProps = EyebrowLabelSharedProps &
  EyebrowLabelRouterLinkProps & {
    as?: ElementType;
  } & Omit<
    ComponentPropsWithoutRef<'span'>,
    keyof EyebrowLabelSharedProps | keyof EyebrowLabelRouterLinkProps
  > &
  Partial<
    Omit<
      ComponentPropsWithoutRef<'a'>,
      keyof EyebrowLabelSharedProps | keyof EyebrowLabelRouterLinkProps
    >
  > &
  Partial<
    Omit<
      ComponentPropsWithoutRef<'label'>,
      keyof EyebrowLabelSharedProps | keyof EyebrowLabelRouterLinkProps
    >
  >;

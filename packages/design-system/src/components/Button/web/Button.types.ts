import type {
  ComponentPropsWithoutRef,
  ElementType,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  SVGProps,
} from 'react';
import type { BaseProps, AccessibilityProps } from '@/types/globalTypes';

export const BUTTON_COLORS = ['neutral', 'brand', 'brand-accent'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['filled', 'outlined', 'ghost'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export const ICON_ONLY_BUTTON_SIZES = ['x-small', 'small', 'medium', 'large'] as const;
export type IconOnlyButtonSize = (typeof ICON_ONLY_BUTTON_SIZES)[number];

/** Extra data to merge into the tracking event. Use for per-button context (e.g. cta_type, module_position). */
export type ButtonAnalytics = Record<string, unknown>;

/**
 * Design-system props for `Button` (always applied). Polymorphic root props (`href`, `prefetch`, etc.)
 * come from `ButtonProps` via `as`.
 */
export interface ButtonSharedProps extends BaseProps, Pick<AccessibilityProps, 'aria-label'> {
  type?: 'button' | 'submit' | 'reset';
  color?: ButtonColor;
  capitalize?: boolean;
  variant?: ButtonVariant;
  /**
   * Button size. Note: 'x-small' is only valid for icon-only buttons (buttons with icon but no text children).
   */
  size?: ButtonSize | 'x-small';
  /**
   * Optional icon — pass an SVG icon element (e.g. from `@/icons`): `icon={<SaveIcon />}`.
   *
   * - **Text + icon:** put the label in `children` and use `iconPosition` for before/after the label.
   * - **Icon-only:** pass `icon` and omit `children`; set **`aria-label`** so the control has an accessible name.
   */
  icon?: ReactElement<SVGProps<SVGSVGElement>>;
  /**
   * Icon placement relative to the text label. Only applies when both `icon` and text `children` are set.
   * @default 'end'
   */
  iconPosition?: 'start' | 'end';
  children?: ReactNode;
  isDisabled?: boolean;
  /** Per-button tracking data merged into the event. Use to distinguish buttons (e.g. cta_type, module_name). */
  analytics?: ButtonAnalytics;
  onClick?: MouseEventHandler<HTMLElement>;
  /**
   * `dark`: dark-surface button styles on a dark region while `:root` is still light theme.
   * Brand palettes follow `DesignSystemProvider` via `html[data-ds-brand]` (web).
   * @default 'light'
   */
  surface?: 'light' | 'dark';
}

/**
 * Optional props commonly used with framework routers (e.g. Next.js `Link`). Forwarded when `as` is that component.
 * This package does not import `next/link`.
 */
export type ButtonRouterLinkProps = {
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

/**
 * Polymorphic button: styles apply to the root from `as`.
 * - Default: native `<button>`; use `type` / `disabled` as usual.
 * - `as="a"`: anchor; pass `href` / `target` / `rel` (from anchor attributes).
 * - `as={NextLink}`: pass `href` and router props (`prefetch`, etc.). Use `isDisabled` for disabled styling (anchors use `aria-disabled`).
 *
 * Types combine native `<button>` and `<a>` props; invalid combinations (e.g. `type` on an anchor) should be avoided at usage sites.
 */
export type ButtonProps = ButtonSharedProps &
  ButtonRouterLinkProps & {
    as?: ElementType;
  } & Omit<
    ComponentPropsWithoutRef<'button'>,
    keyof ButtonSharedProps | keyof ButtonRouterLinkProps
  > &
  Partial<
    Omit<ComponentPropsWithoutRef<'a'>, keyof ButtonSharedProps | keyof ButtonRouterLinkProps>
  >;

/** @deprecated Use `ButtonSharedProps` — kept for older imports. */
export type ButtonOwnProps = ButtonSharedProps;

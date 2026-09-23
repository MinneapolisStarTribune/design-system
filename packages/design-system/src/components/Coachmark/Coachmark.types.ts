import type { ReactNode } from 'react';

/**
 * Which side of `children` the coachmark opens on. 'center' opts out of top/bottom entirely --
 * combined with `align: 'left' | 'right'`, the coachmark instead opens to the opposite side,
 * vertically centered on `children` (see `align`'s doc comment for the full combination table).
 */
export type CoachmarkPosition = 'top' | 'bottom' | 'center';

/**
 * Horizontal alignment of the coachmark relative to `children`, independent of `position`'s
 * side. Combines with `position` as follows:
 * - `position: 'top' | 'bottom'` -- `align` shifts the coachmark along that edge ('left'/'right'
 *   map onto floating-ui's placement alignment, i.e. '-start'/'-end'; 'center' is no suffix).
 * - `position: 'center'` -- `align` describes which side `children` itself sits against (e.g.
 *   'right' for a trigger flush with the right edge of the screen), and the coachmark opens on
 *   the *opposite* side, where there's room, vertically centered on `children`. `align: 'center'`
 *   has no side to anchor to in this case, so it falls back to the overall default
 *   (`position: 'bottom'`, centered).
 *
 * Physical left/right, not logical start/end, since this is a fixed-locale product with no RTL
 * support.
 */
export type CoachmarkAlign = 'left' | 'right' | 'center';

export type CoachmarkProps = {
  /**
   * The element the coachmark is anchored to. Rendering/behavior of this element is otherwise
   * untouched -- the coachmark is a separate floating panel layered on top of it.
   */
  children: ReactNode;

  /**
   * Controlled open state. A coachmark always appears in response to an explicit external event
   * (e.g. a CMS-driven prompt), never hover/focus, so this is required rather than
   * internally managed.
   */
  open: boolean;

  /** Called when the coachmark requests an open/close transition (e.g. its own close button). */
  onOpenChange: (open: boolean) => void;

  /** Heading text. */
  title: string;

  /** Supporting body text below the title. */
  description: string;

  /** Optional icon shown in a circular badge above the title. */
  icon?: ReactNode;

  /** Label for the solid action button. Omit to render the coachmark with no action button. */
  ctaText?: string;

  /** Renders the action as a link to this href instead of a button with `onAction`. */
  actionHref?: string;

  /** Called when the action button is clicked. Ignored when `actionHref` is set. */
  onAction?: () => void;

  /** Optional content rendered below the action button, e.g. a secondary link. */
  secondaryContent?: ReactNode;

  /** Which side of `children` the coachmark opens on. Defaults to 'bottom'. */
  position?: CoachmarkPosition;

  /** Horizontal alignment relative to `children`, independent of `position`. Defaults to 'center'. */
  align?: CoachmarkAlign;

  /**
   * Whether an outside click or Escape closes the coachmark. Defaults to false -- a coachmark
   * appears unprompted, so it should only close via its own close button or action button unless
   * explicitly opted into dismissing on outside click.
   */
  dismissOnOutsideClick?: boolean;

  /** Portal target for the floating panel. Defaults to document.body. */
  portalRoot?: HTMLElement | null;

  /** z-index override for the floating panel. */
  zIndex?: number;
};

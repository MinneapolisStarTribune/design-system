import type { ReactNode } from 'react';
import type { FloatingPlacement } from '@/components/FloatingPopup/FloatingPopup.types';
import type { Responsive } from '@/types/globalTypes';

/**
 * Placements the coachmark design supports. Side placements stay vertically centered on
 * `children`.
 */
export const COACHMARK_PLACEMENTS = [
  'top-start',
  'top',
  'top-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left',
  'right',
] as const satisfies readonly FloatingPlacement[];

export type CoachmarkPlacement = (typeof COACHMARK_PLACEMENTS)[number];

/** 'stacked' puts full-width actions in a column. 'inline' puts them in a row at the end. */
export const COACHMARK_CTA_LAYOUTS = ['stacked', 'inline'] as const;

export type CoachmarkCtaLayout = (typeof COACHMARK_CTA_LAYOUTS)[number];

/** Horizontal alignment of the title/description within the card. */
export const COACHMARK_ALIGNMENTS = ['left', 'center'] as const;

export type CoachmarkAlignment = (typeof COACHMARK_ALIGNMENTS)[number];

/** Extra data to merge into the tracking event(s) (web analytics). */
export type CoachmarkAnalytics = Record<string, unknown>;

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

  /**
   * Optional label (e.g. "New") shown in a small pill in the card's top-left corner, vertically
   * centered 24px from the card's top edge. Omit to render the coachmark with no badge.
   */
  badgeText?: string;

  /** Label for the filled primary action. Omit both actions to render no footer. */
  ctaText?: string;

  /** Renders the primary action as a link to this href instead of a button with `onAction`. */
  actionHref?: string;

  /** Called when the primary action is clicked. Ignored when `actionHref` is set. */
  onAction?: () => void;

  /** Label for the ghost secondary action. */
  secondaryCtaText?: string;

  /** Renders the secondary action as a link to this href instead of a button. */
  secondaryActionHref?: string;

  /** Called when the secondary action is clicked. Ignored when `secondaryActionHref` is set. */
  onSecondaryAction?: () => void;

  /** Content below the actions, such as an "Already have an account? Log in" link. */
  secondaryContent?: ReactNode;

  /**
   * Layout of the actions. Use 'stacked' for long or localized labels and 'inline' when both
   * labels are short. Defaults to 'stacked'.
   */
  ctaLayout?: CoachmarkCtaLayout;

  /** Replaces the close button with step progress text, such as "1 of 3". */
  counter?: string;

  /**
   * Shows the close button. Defaults to true. Without it, give people another way to dismiss, such
   * as an action or `dismissOnOutsideClick`.
   */
  showCloseButton?: boolean;

  /**
   * Where the coachmark opens relative to `children`, named like Menu and Popover placements but
   * limited to `COACHMARK_PLACEMENTS`. Accepts a value per breakpoint. Defaults to 'bottom'.
   */
  placement?: Responsive<CoachmarkPlacement>;

  /**
   * Horizontal alignment of the title/description. Defaults to 'center'.
   */
  alignment?: CoachmarkAlignment;

  /**
   * Whether an outside click or Escape closes the coachmark. Defaults to false -- a coachmark
   * appears unprompted, so it should only close via its own close button or action button unless
   * explicitly opted into dismissing on outside click.
   */
  dismissOnOutsideClick?: boolean;

  /**
   * Renders the coachmark in this element instead of `document.body`. The coachmark also flips and
   * shifts to stay inside this element, so it must not clip the space the coachmark needs.
   */
  portalRoot?: HTMLElement | null;

  /**
   * Repositions on every animation frame instead of only on scroll/resize events. Defaults to
   * false. Turn on when `children` scrolls within the page (e.g. a table row) rather than staying
   * fixed on screen (e.g. a sticky header icon) -- event-based repositioning has to recompute and
   * reapply position via JS on each scroll event, which can visibly lag behind a reference that's
   * continuously moving, where per-frame polling does not. Costs a continuous requestAnimationFrame
   * loop while open, so leave off for a reference that doesn't move.
   */
  trackReferenceMovement?: boolean;

  /**
   * Renders an empty, inert tracking element (id set to this value) inside the floating panel
   * itself, sized/positioned to exactly cover it. For a third party (e.g. Piano) that tracks
   * impressions by watching whether *its own* element intersects the viewport, rather than
   * anything this component exposes directly -- that element needs to actually move and resize
   * with the panel to reflect this coachmark's real on-screen visibility, not just exist
   * somewhere else on the page. Omit if nothing needs to observe that.
   */
  impressionTrackingId?: string;

  /** z-index override for the floating panel. */
  zIndex?: number;

  /**
   * Extra data merged into `coachmark_shown`/`coachmark_dismiss`/`coachmark_cta_click` tracking
   * events (see `useAnalytics`/`AnalyticsProvider`), e.g. a Piano campaign id.
   */
  analytics?: CoachmarkAnalytics;
};

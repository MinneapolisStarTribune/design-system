import type { ReactNode } from 'react';

/**
 * Which side of `children` the coachmark opens on, and where along that side. The first segment
 * is the side ('top'/'bottom' open above/below `children`; 'left'/'right' open beside it,
 * vertically centered, e.g. for a trigger flush against a screen edge with no room above/below).
 * The second segment positions the card along a 'top'/'bottom' side ('left'/'right' shift the
 * card so it visually sits toward that side of `children`, 'center' centers it) -- 'left'/'right'
 * have no second axis to position along, so they're always paired with 'center'.
 *
 * Physical left/right, not logical start/end, since this is a fixed-locale product with no RTL
 * support.
 */
export const COACHMARK_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
  'center-left',
  'center-right',
] as const;

export type CoachmarkPosition = (typeof COACHMARK_POSITIONS)[number];

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

  /** Label for the solid action button. Omit to render the coachmark with no action button. */
  ctaText?: string;

  /** Renders the action as a link to this href instead of a button with `onAction`. */
  actionHref?: string;

  /** Called when the action button is clicked. Ignored when `actionHref` is set. */
  onAction?: () => void;

  /** Optional content rendered below the action button, e.g. a secondary link. */
  secondaryContent?: ReactNode;

  /**
   * Which side of `children` the coachmark opens on, and where along that side. Defaults to
   * 'bottom-center'.
   */
  position?: CoachmarkPosition;

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

  /** Portal target for the floating panel. Defaults to document.body. */
  portalRoot?: HTMLElement | null;

  /** z-index override for the floating panel. */
  zIndex?: number;

  /**
   * Extra data merged into `coachmark_shown`/`coachmark_dismiss`/`coachmark_cta_click` tracking
   * events (see `useAnalytics`/`AnalyticsProvider`), e.g. a Piano campaign id.
   */
  analytics?: CoachmarkAnalytics;
};

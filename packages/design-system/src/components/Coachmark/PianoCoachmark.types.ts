import type { ReactNode } from 'react';
import type { CoachmarkAlignment, CoachmarkPosition } from './Coachmark.types';

/**
 * Payload shape for Piano-triggered coachmark content. Field names match Piano's own
 * `setResponseVariable` response-variable names directly (`ctaText`, `position`,
 * `dismissOnOutsideClick`, `title`, `description`, `icon`) -- and, in turn, `Coachmark`'s own
 * prop names -- so no renaming happens at either boundary.
 */
export interface PianoCoachmarkPayload {
  /** Bold title text for the piano-triggered coachmark content. */
  title: string;
  /** Gray description paragraph for the piano-triggered coachmark content. */
  description: string;
  /** Label for the action button, e.g. "Create Free Account" or "Add To Favorites". */
  ctaText: string;
  /**
   * Selects which registered `PianoCtaAction` (from a consumer-supplied `PianoCtaActionRegistry`)
   * renders/handles the action button, e.g. "signup" or "favorite". Unrecognized types render no
   * button.
   */
  ctaType: string;
  /**
   * Optional image URL (e.g. a Star Tribune CDN asset) rendered in a circular badge above the
   * title, e.g. "https://static.startribune.com/assets/piano/coach-mark/star.svg". Piano supplies
   * the full URL directly -- there's no app-side name-to-asset lookup.
   */
  icon?: string;
  /**
   * Optional label (e.g. "New") rendered in a small pill in the card's top-left corner, vertically
   * centered 24px from the card's top edge. Omit for no badge.
   */
  badgeText?: string;
  /**
   * Which side of the trigger the coachmark opens on, and where along that side -- e.g.
   * "top-left", "bottom-right", "center-left". Defaults to "bottom-center" when omitted.
   */
  position?: CoachmarkPosition;
  /**
   * Horizontal alignment of the title/description -- "left" or "center". Defaults to "center"
   * when omitted.
   */
  alignment?: CoachmarkAlignment;
  /**
   * Whether an outside click closes the coachmark, in addition to the close button and the
   * action button's own behavior. Defaults to false when omitted.
   */
  dismissOnOutsideClick?: boolean;
  /**
   * Whether to render the registered `ctaAction`'s `renderSecondary` content (e.g. a "Log in"
   * link below the action button). Defaults to false when omitted -- the secondary content is
   * opt-in per Piano campaign, not shown just because the `ctaAction` happens to support it.
   */
  showLogin?: boolean;
}

/** Helpers a `PianoCtaAction`'s `onClick`/`renderSecondary` can use. */
export interface PianoCtaActionContext {
  /** Closes the piano-triggered coachmark, e.g. after handling the action. */
  dismiss: () => void;
}

interface PianoCtaActionBase {
  /** Optional content rendered below the button, e.g. a secondary login link. */
  renderSecondary?: (context: PianoCtaActionContext) => ReactNode;
}

/**
 * Defines how a single `ctaType` value (from Piano's response variables) renders and behaves.
 * Registries are plain objects keyed by `ctaType`, so any app can supply its own without needing
 * a code change here -- see `PianoCoachmark`'s `ctaActions` prop. A primary action -- `href` (the
 * button renders as a link) or `onClick` (a button with a handler) -- is required; a registry
 * entry with neither would render an enabled-looking button that does nothing.
 */
export type PianoCtaAction =
  | (PianoCtaActionBase & {
      /** Renders the button as a link to this href instead of a button with `onClick`. */
      href: string;
      onClick?: never;
    })
  | (PianoCtaActionBase & {
      href?: never;
      /** Called when the button is clicked. */
      onClick: (context: PianoCtaActionContext) => void;
    });

export type PianoCtaActionRegistry = Record<string, PianoCtaAction>;

export interface PianoCoachmarkProps {
  /** Stable id Piano's `setResponseVariable` event targets via its `id` field. */
  id: string;
  /**
   * The element(s) to anchor the coachmark to. This has no effect on `children`'s own behavior
   * or rendering -- the coachmark is a wholly separate floating panel layered on top, not a
   * container that changes what `children` shows.
   */
  children: ReactNode;
  /**
   * `ctaType` -> `PianoCtaAction` lookup used to render/handle the action button. Apps supply
   * their own registry -- there is no shared default, since the actual behaviors (opening a
   * signup screen, toggling a favorite) are always app-specific.
   */
  ctaActions: PianoCtaActionRegistry;
  /**
   * Called whenever the coachmark's own Piano-triggered open state changes. Lets a consumer
   * coordinate other UI anchored to the same trigger (e.g. suppressing a hover popover while the
   * coachmark is showing) without calling `useExternalTriggerState` itself -- keeping that hook's
   * only call site the one already exercised here.
   */
  onTriggeredChange?: (isTriggered: boolean) => void;
}

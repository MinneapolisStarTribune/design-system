import { HTMLAttributes, ReactNode } from 'react';
import type { Position } from '@/types';

export type Placement = Position;

export type PopoverProps = {
  /**
   * Omit for a popover with no local open affordance — one that can only ever be opened
   * externally via `triggerId`, e.g. content that's only ever shown by an external trigger,
   * placed anywhere on the page with no visible trigger element.
   */
  trigger?: ReactNode;
  /**
   * Rendered when this popover is open due to a normal in-app interaction (clicking `trigger`).
   * Not rendered while open due to an external trigger — see `externalContent` instead.
   */
  children?: ReactNode;
  /**
   * Unique id an external caller (via `useTriggerExternal()`) can use to open this popover and
   * supply `externalContent`. Omit entirely for a popover that only ever opens from `trigger`.
   */
  triggerId?: string;
  /**
   * Rendered instead of `children` while this popover is open because it was triggered
   * externally (via `triggerId`) — e.g. `<Popover.ExternalContent .../>`. Falls back to
   * `children` if omitted.
   */
  externalContent?: ReactNode;
  /**
   * Which side of the trigger the popover appears on.
   * Defaults to 'bottom'.
   */
  placement?: Placement;
  isDisabled?: boolean;
  /**
   * Whether to trap focus inside the popover (modal behavior).
   * Use `true` for action-heavy popovers, `false` for informational ones.
   * Defaults to false.
   */
  modal?: boolean;

  /**
   * @deprecated Use contentClassName instead.
   * Kept for backwards compatibility.
   */
  className?: string;

  wrapperClassName?: string;
  containerClassName?: string;
  contentClassName?: string;
  arrowClassName?: string;
  /** Controlled open state. If omitted, the component manages open state internally. */
  open?: boolean;
  /** Called when the popover requests an open/close transition. Required when `open` is provided. */
  onOpenChange?: (open: boolean) => void;
  /** When set, the popover content portals into this element instead of document.body (e.g. for Storybook). */
  portalRoot?: HTMLElement | null;
  /** Accessible label for the popover dialog. Provide this when no PopoverHeading is rendered. */
  'aria-label'?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'>;

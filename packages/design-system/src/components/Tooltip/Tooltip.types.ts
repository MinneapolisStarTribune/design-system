import { HTMLAttributes, ReactNode } from 'react';
import type { IconPosition, Position } from '@/types';

export type { IconPosition };
export type Placement = Position;

export type TooltipProps = {
  /**
   * The element that triggers the tooltip on hover or focus (or click — see `content`).
   */
  children: ReactNode;

  /**
   * Brief supplemental text displayed in the tooltip. Ignored when `content` is given.
   */
  label?: string;

  /**
   * Rich content shown instead of `label`/`icon` — any custom layout, including one with
   * interactive elements (links, a dismiss button). Providing this switches the tooltip from its
   * default hover/focus-revealed, non-interactive behavior (ARIA `tooltip` role) to a
   * click-triggered, interactive one (ARIA `dialog` role) — matching the accessibility
   * expectation that a `tooltip`-role element never contains focusable content.
   */
  content?: ReactNode;

  /**
   * Which side of the trigger the tooltip appears on.
   * Defaults to 'top'.
   */
  pointer?: Placement;

  /**
   * Optional icon to display in the tooltip.
   */
  icon?: ReactNode;

  /**
   * Position of the icon relative to the label.
   * Defaults to 'start'.
   */
  iconPosition?: IconPosition;

  /**
   * Whether the tooltip is disabled.
   */
  isDisabled?: boolean;

  /**
   * When set, the tooltip content portals into this element instead of document.body.
   * Use for Storybook or when portaling into a specific container.
   */
  portalRoot?: HTMLElement | null;

  /**
   * Delay (in milliseconds) before showing the tooltip on hover.
   * Defaults to 200ms.
   */
  showDelay?: number;

  /**
   * Delay (in milliseconds) before hiding the tooltip when not hovering/focused.
   * Defaults to 0ms.
   */
  hideDelay?: number;

  wrapperClassName?: string;
  contentClassName?: string;
  arrowClassName?: string;
  labelClassName?: string;
  iconClassName?: string;

  /** Accessible label for the tooltip. Use when label is not descriptive enough. */
  'aria-label'?: string;

  /** Override the z-index of the floating tooltip element. Defaults to 9999. */
  zIndex?: number;

  /**
   * Controlled open state. If omitted, the component manages open state internally
   * (hover/focus/click, per `content`'s presence).
   */
  open?: boolean;

  /**
   * Whether an outside click or Escape closes the tooltip. Defaults to true. Set to false for
   * content that should only close via its own explicit controls (e.g. a close button or action
   * inside `content`, using `useTooltipCloseContext`) — for example, content that appeared
   * unprompted and shouldn't disappear from an unrelated click elsewhere on the page.
   */
  dismissible?: boolean;

  /** Called when the tooltip requests an open/close transition. Required when `open` is provided. */
  onOpenChange?: (open: boolean) => void;
} & Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'content'>;

import { HTMLAttributes, ReactNode } from 'react';

export type Placement = 'top' | 'right' | 'bottom' | 'left';

export type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
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

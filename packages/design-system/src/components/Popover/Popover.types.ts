import { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import type { FloatingFocusManager, UseRoleProps } from '@floating-ui/react';
import type { Position } from '@/types';

/** A side, optionally aligned to the start or end edge of the anchor (e.g. 'bottom-start'). */
export type Placement = Position | `${Position}-${'start' | 'end'}`;

type PopoverTriggerProps = {
  /** Element that toggles the popover on click. */
  trigger: ReactNode;
  anchorEl?: never;
};

type PopoverAnchorProps = {
  /** Element to position against instead of a trigger. Anchored popovers must be controlled. */
  anchorEl: Element | null;
  trigger?: never;
  open: boolean;
};

export type PopoverBaseProps = {
  children: ReactNode;
  /** Which side of the trigger or anchor the popover appears on. Defaults to 'bottom'. */
  placement?: Placement;
  isDisabled?: boolean;
  /** Whether to trap focus inside the popover (modal behavior). Defaults to false. */
  modal?: boolean;
  /** @deprecated Use contentClassName instead. Kept for backwards compatibility. */
  className?: string;
  wrapperClassName?: string;
  containerClassName?: string;
  contentClassName?: string;
  arrowClassName?: string;
  /** Controlled open state. If omitted, the component manages open state internally. Required with `anchorEl`. */
  open?: boolean;
  /** Called when the popover requests an open/close transition. Required when `open` is provided. */
  onOpenChange?: (open: boolean) => void;
  /** When set, the popover content portals into this element instead of document.body. */
  portalRoot?: HTMLElement | null;
  /** Accessible label for the floating element. Provide this when no PopoverHeading is rendered. */
  'aria-label'?: string;
  /** ARIA role of the floating element. Defaults to 'dialog'. */
  role?: UseRoleProps['role'];
  hideArrow?: boolean;
  arrowStaticOffset?: string | number | null;
  arrowSize?: { width: number; height: number };
  arrowPadding?: number;
  initialFocus?: ComponentProps<typeof FloatingFocusManager>['initialFocus'];
} & Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'role'>;

export type PopoverProps = PopoverBaseProps & (PopoverTriggerProps | PopoverAnchorProps);

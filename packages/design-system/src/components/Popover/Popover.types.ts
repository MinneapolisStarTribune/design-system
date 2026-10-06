import { HTMLAttributes, ReactNode } from 'react';
import { POSITIONS } from '@/types';
import type { BaseProps } from '@/types/globalTypes';

export const POPOVER_PLACEMENTS = POSITIONS;

export type Placement = (typeof POPOVER_PLACEMENTS)[number];

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
  /** Applied to the popover surface. */
  className?: string;
  /** Controlled open state. If omitted, the component manages open state internally. */
  open?: boolean;
  /** Called when the popover requests an open/close transition. Required when `open` is provided. */
  onOpenChange?: (open: boolean) => void;
  /** When set, the popover content portals into this element instead of document.body (e.g. for Storybook). */
  portalRoot?: HTMLElement | null;
  /**
   * Accessible label for the popover dialog. Used only when there is no `Popover.Heading`. With a
   * heading, the heading names the dialog instead.
   */
  'aria-label'?: string;
} & Pick<HTMLAttributes<HTMLDivElement>, 'id' | 'style'> &
  Pick<BaseProps, 'dataTestId'>;

/** Props shared by the popover sections. */
export interface PopoverSectionProps extends Pick<BaseProps, 'className' | 'dataTestId'> {
  children: ReactNode;
}

export interface PopoverHeadingProps extends PopoverSectionProps {
  /** Small label above the title, such as a date. It is not part of the popover's accessible name. */
  eyebrow?: string | number;
  /** Content at the end of the title row, such as a total. It is not part of the accessible name. */
  value?: ReactNode;
  /**
   * Shows the close button.
   * @default true
   */
  showCloseButton?: boolean;
}

export interface PopoverBodyProps extends PopoverSectionProps {
  scrollable?: boolean;
}

export interface PopoverDividerProps extends Pick<BaseProps, 'className' | 'dataTestId'> {
  /** @default true */
  fullBleed?: boolean;
}

import { HTMLAttributes, ReactNode } from 'react';
import type { IconPosition, Position } from '@/types';

export type { IconPosition };
export type Placement = Position;

export type TooltipProps = {
  /**
   * The element that triggers the tooltip on hover or focus.
   */
  children: ReactNode;

  /**
   * Brief supplemental text displayed in the tooltip.
   */
  label: string;

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
} & Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'>;

import { HTMLAttributes, ReactNode } from 'react';
import type { Position } from '@/types';
import type { UseExternalTriggerOptions } from '@/hooks/useExternalTrigger';

export type Placement = Position;

/** @deprecated Use `PopoverProps` (with `triggerId`/`externalContent`) instead. */
export type TriggerablePopoverProps = {
  trigger: ReactNode;
  /**
   * Rendered when this popover is open due to a normal in-app interaction (clicking `trigger`).
   * Not rendered while open due to an external trigger — see `injectedContent` instead.
   */
  children: ReactNode;
  /**
   * Unique id an outside script can use to open/close this popover (via
   * `window[openGlobalName]`/`window[closeGlobalName]`) and, when `enableInjectionSlot` is set,
   * inject content into. Omit entirely for a popover that only ever opens from `trigger`.
   */
  triggerId?: string;
  /**
   * Reserves a DOM node (id: `${triggerId}-injection-slot`) that an external script can find and
   * inject content into (e.g. a vendor iframe), mounted ahead of the first external open so it's
   * ready by the time that script runs. Requires `triggerId`. Default: `false`.
   */
  enableInjectionSlot?: boolean;
  /** Which side of the trigger the popover appears on. Default: `'bottom'`. */
  placement?: Placement;
  isDisabled?: boolean;
  /** Whether to trap focus inside the popover (modal behavior). Default: `false`. */
  modal?: boolean;
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
  /** Overrides for the external-trigger mechanism's default global names/timings. */
  externalTriggerOptions?: UseExternalTriggerOptions;
} & Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'children'>;

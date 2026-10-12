'use client';

import { useCallback, useState } from 'react';
import { arrow, autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react';
import type { Middleware, OpenChangeReason } from '@floating-ui/react';
import type { AnchoredMiddlewareOptions, UseFloatingPopupOptions } from './FloatingPopup.types';

/** Space between the anchor and the surface, added to the arrow height. */
const FLOATING_GAP = 4;

/** Popover and Menu positioning. */
export const createAnchoredMiddleware =
  ({ boundary, arrowSpec, hideArrow = false }: AnchoredMiddlewareOptions) =>
  (arrowElement: SVGSVGElement | null): Middleware[] => [
    offset(hideArrow ? FLOATING_GAP : arrowSpec.height + FLOATING_GAP),
    // A side placement that fits neither side falls back to below or above the anchor. Edge overflow
    // flips only the `-start`/`-end` alignment, never the side, and `shift` slides the surface back in.
    flip({
      boundary,
      padding: FLOATING_GAP,
      crossAxis: 'alignment',
      fallbackAxisSideDirection: 'end',
    }),
    shift({ boundary, padding: FLOATING_GAP }),
    // Expose the space left on the chosen side so surface styles can shrink to fit narrow screens.
    size({
      boundary,
      padding: FLOATING_GAP,
      apply({ availableWidth, availableHeight, elements }) {
        elements.floating.style.setProperty('--floating-available-width', `${availableWidth}px`);
        elements.floating.style.setProperty('--floating-available-height', `${availableHeight}px`);
      },
    }),
    arrow({ element: arrowElement, padding: arrowSpec.cornerInset }),
  ];

/** Open state, controlled or uncontrolled, and positioning. */
export const useFloatingPopup = ({
  open: openProp,
  onOpenChange,
  onClose,
  placement,
  disabled = false,
  middleware,
  strategy,
  autoUpdateOptions,
  nodeId,
}: UseFloatingPopupOptions) => {
  const [openState, setOpenState] = useState(false);
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;

  const setOpen = useCallback(
    (isOpen: boolean, _event?: Event, reason?: OpenChangeReason) => {
      if (disabled && isOpen) return;
      if (!isControlled) setOpenState(isOpen);
      if (!isOpen) onClose?.(reason);
      onOpenChange?.(isOpen);
    },
    [disabled, isControlled, onOpenChange, onClose]
  );

  const floating = useFloating({
    nodeId,
    placement,
    strategy,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: (reference, floatingElement, update) =>
      autoUpdate(reference, floatingElement, update, autoUpdateOptions),
    middleware: middleware(arrowElement),
  });

  return { ...floating, open, setOpen, setArrowElement };
};

'use client';

import { arrow, autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react';
import type { Middleware, OpenChangeReason, Placement, ReferenceType } from '@floating-ui/react';

/** Default gap between the anchor and the floating element, and the edge padding for `flip`, `shift`, and `size`. */
export const FLOATING_GAP = 4;

/**
 * Closes the floating element when its anchor stops rendering, such as when a responsive layout
 * hides it with `display: none`. Without this, the element stays open at the top left of the page
 * with no width. Browsers without `checkVisibility` keep the element open.
 */
const closeWhenAnchorHidden = (
  onOpenChange: UseAnchoredFloatingOptions['onOpenChange']
): Middleware => ({
  name: 'closeWhenAnchorHidden',
  fn({ elements }) {
    const { reference } = elements;
    if (
      reference instanceof Element &&
      typeof reference.checkVisibility === 'function' &&
      !reference.checkVisibility()
    ) {
      onOpenChange?.(false);
    }
    return {};
  },
});

type UseAnchoredFloatingOptions = {
  open: boolean;
  onOpenChange?: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
  placement: Placement;
  /** Edge padding for `flip`, `shift`, and `size`. */
  gap?: number;
  /** Distance from the anchor. Defaults to `gap`. */
  offset?: number;
  /** Keeps the floating element inside this element instead of the viewport. */
  portalRoot?: HTMLElement | null;
  /** Sets the floating element's width to the anchor's width. */
  matchAnchorWidth?: boolean;
  arrow?: { element: SVGSVGElement | null; padding?: number };
};

/**
 * Shared anchor positioning for Popover, Menu, and Select: flips and shifts to stay in view, and
 * exposes the remaining space as `--floating-available-width` and `--floating-available-height`.
 */
export const useAnchoredFloating = <RT extends ReferenceType = Element>({
  open,
  onOpenChange,
  placement,
  gap = FLOATING_GAP,
  offset: offsetDistance = gap,
  portalRoot,
  matchAnchorWidth = false,
  arrow: arrowOptions,
}: UseAnchoredFloatingOptions) => {
  const boundary = portalRoot ?? undefined;

  return useFloating<RT>({
    open,
    onOpenChange,
    placement,
    // The portal can sit inside a scrolling or `overflow: hidden` dialog panel; `fixed` escapes it.
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      closeWhenAnchorHidden(onOpenChange),
      offset(offsetDistance),
      flip({ boundary, padding: gap, crossAxis: 'alignment', fallbackAxisSideDirection: 'end' }),
      shift({ boundary, padding: gap }),
      size({
        boundary,
        padding: gap,
        apply({ rects, availableWidth, availableHeight, elements }) {
          const { style } = elements.floating;
          style.setProperty('--floating-available-width', `${availableWidth}px`);
          style.setProperty('--floating-available-height', `${availableHeight}px`);
          if (matchAnchorWidth) style.width = `${rects.reference.width}px`;
        },
      }),
      arrowOptions && arrow(arrowOptions),
    ],
  });
};

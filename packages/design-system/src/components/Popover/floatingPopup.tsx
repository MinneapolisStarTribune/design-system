'use client';

import { arrow, FloatingArrow, flip, offset, shift, size } from '@floating-ui/react';
import type { ComponentProps, CSSProperties, Ref } from 'react';
import type { Middleware, Placement } from '@floating-ui/react';
import styles from './Popover.module.scss';

/** Shared by Popover and Menu. Tooltip and Coachmark position themselves. */

export type PopupArrowSpec = {
  width: number;
  height: number;
  /** Minimum distance from the arrow to the surface's rounded corners. */
  cornerInset: number;
};

/** Fixed arrow positions on the surface edge that faces the anchor. */
export const ARROW_OFFSETS = ['start', 'center', 'end'] as const;

export type ArrowOffset = (typeof ARROW_OFFSETS)[number];

/** Trigger element props the popup reads before cloning the trigger. */
export type PopupTriggerProps = { style?: CSSProperties; ref?: Ref<Element> };

/** Space between the anchor and the surface, added to the arrow height. */
const FLOATING_GAP = 4;

type PopupMiddlewareOptions = {
  boundary: HTMLElement | undefined;
  arrowElement: SVGSVGElement | null;
  arrowSpec: PopupArrowSpec;
  hideArrow?: boolean;
};

export const getPopupMiddleware = ({
  boundary,
  arrowElement,
  arrowSpec,
  hideArrow = false,
}: PopupMiddlewareOptions): Middleware[] => [
  offset(hideArrow ? FLOATING_GAP : arrowSpec.height + FLOATING_GAP),
  // A side placement that fits neither side falls back to below or above the anchor.
  flip({ boundary, padding: FLOATING_GAP, fallbackAxisSideDirection: 'end' }),
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

/**
 * Converts an `ArrowOffset` to the `FloatingArrow` `staticOffset` value.
 * Returns null when `offset` is not set. Floating UI then points to the anchor center.
 *
 * For `-end` placements, FloatingArrow measures from the surface end edge. This function swaps
 * `start` and `end` for these placements.
 */
export const resolveArrowOffset = (
  offset: ArrowOffset | undefined,
  placement: Placement,
  { width, cornerInset }: PopupArrowSpec
): string | null => {
  if (offset === undefined) return null;
  // Subtract half the arrow width to center it.
  if (offset === 'center') return `calc(50% - ${width / 2}px)`;

  const nearEdge = `${cornerInset}px`;
  // `staticOffset` sets the arrow's near edge. Subtract the arrow width for the far edge.
  const farEdge = `calc(100% - ${cornerInset + width}px)`;
  const measuresFromEnd = placement.endsWith('-end');
  if (offset === 'start') return measuresFromEnd ? farEdge : nearEdge;
  return measuresFromEnd ? nearEdge : farEdge;
};

type PopupArrowProps = Pick<
  ComponentProps<typeof FloatingArrow>,
  'ref' | 'context' | 'staticOffset'
> & { arrowSpec: PopupArrowSpec };

/** Bordered arrow that blends into the surface border. */
export const PopupArrow = ({ arrowSpec, ...rest }: PopupArrowProps) => (
  <FloatingArrow
    {...rest}
    width={arrowSpec.width}
    height={arrowSpec.height}
    strokeWidth={1}
    className={styles.arrow}
  />
);

/** Surface chrome classes: `wrapper` on the floating element, then `container` and `content`. */
export { styles as popupStyles };

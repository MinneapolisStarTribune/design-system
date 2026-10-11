'use client';

import { arrow, FloatingArrow, flip, offset, shift, size } from '@floating-ui/react';
import type { ComponentProps, CSSProperties, Ref } from 'react';
import type { Middleware } from '@floating-ui/react';
import styles from './Popover.module.scss';

/** Shared by Popover and Menu. Tooltip and Coachmark position themselves. */

export type ArrowSize = { width: number; height: number };

/** Trigger element props the popup reads before cloning the trigger. */
export type PopupTriggerProps = { style?: CSSProperties; ref?: Ref<Element> };

export const POPOVER_ARROW_SIZE: ArrowSize = { width: 16, height: 8 };
/** Space between the anchor and the surface, added to the arrow height. */
const FLOATING_GAP = 4;

type PopupMiddlewareOptions = {
  boundary: HTMLElement | undefined;
  arrowElement: SVGSVGElement | null;
  arrowSize: ArrowSize;
  arrowPadding?: number;
  hideArrow?: boolean;
};

export const getPopupMiddleware = ({
  boundary,
  arrowElement,
  arrowSize,
  arrowPadding = 0,
  hideArrow = false,
}: PopupMiddlewareOptions): Middleware[] => [
  offset(hideArrow ? FLOATING_GAP : arrowSize.height + FLOATING_GAP),
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
  arrow({ element: arrowElement, padding: arrowPadding }),
];

type PopupArrowProps = Pick<
  ComponentProps<typeof FloatingArrow>,
  'ref' | 'context' | 'staticOffset'
> & { arrowSize: ArrowSize };

/** Bordered arrow that blends into the surface border. */
export const PopupArrow = ({ arrowSize, ...rest }: PopupArrowProps) => (
  <FloatingArrow
    {...rest}
    width={arrowSize.width}
    height={arrowSize.height}
    strokeWidth={1}
    className={styles.arrow}
  />
);

/** Surface chrome classes: `wrapper` on the floating element, then `container` and `content`. */
export { styles as popupStyles };

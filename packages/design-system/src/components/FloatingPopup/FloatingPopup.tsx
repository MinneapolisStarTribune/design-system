'use client';

import { cloneElement } from 'react';
import classNames from 'classnames';
import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from '@floating-ui/react';
import type { CSSProperties, ReactElement, Ref, SyntheticEvent } from 'react';
import type { Placement } from '@floating-ui/react';
import styles from './FloatingPopup.module.scss';
import type {
  ArrowOffset,
  FloatingPopupSurfaceProps,
  PopupArrowProps,
  PopupArrowSpec,
  PopupTriggerProps,
} from './FloatingPopup.types';

/**
 * Internal to Popover, Menu, and Coachmark, and not exported from the package. Each root keeps its
 * own interaction hooks and passes `context` in.
 */

const KEY_HANDLERS = new Set(['onKeyDown', 'onKeyUp']);

/**
 * Merges the popup's props over the trigger's props. The trigger's handlers run first, and a key
 * event it prevents does not reach the popup. `getReferenceProps` alone runs the popup's first.
 */
const composeTriggerProps = (
  elementProps: Record<string, unknown>,
  popupProps: Record<string, unknown>
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(popupProps).map(([key, popupValue]) => {
      const elementValue = elementProps[key];
      if (typeof popupValue !== 'function' || typeof elementValue !== 'function') {
        return [key, popupValue];
      }
      return [
        key,
        (event: SyntheticEvent) => {
          elementValue(event);
          if (KEY_HANDLERS.has(key) && event.defaultPrevented) return;
          popupValue(event);
        },
      ];
    })
  );

/** Clones the trigger with the popup's props and `ref`. The trigger's style wins over `cursor`. */
export const cloneTrigger = (
  element: ReactElement<PopupTriggerProps>,
  ref: Ref<Element>,
  popupProps: Record<string, unknown>,
  cursor: CSSProperties['cursor']
) =>
  cloneElement(element, {
    ...composeTriggerProps(element.props, popupProps),
    ref,
    style: { cursor, ...element.props.style },
  });

/**
 * Converts an `ArrowOffset` to `FloatingArrow`'s `staticOffset`. Returns null when unset, so the
 * arrow points at the anchor center. `-end` placements measure from the end edge, so `start` and
 * `end` swap.
 */
export const resolveArrowOffset = (
  offset: ArrowOffset | undefined,
  placement: Placement,
  { width, cornerInset }: PopupArrowSpec
): string | null => {
  if (offset === undefined) return null;
  if (offset === 'center') return `calc(50% - ${width / 2}px)`;

  const nearEdge = `${cornerInset}px`;
  // `staticOffset` sets the arrow's near edge. Subtract the arrow width for the far edge.
  const farEdge = `calc(100% - ${cornerInset + width}px)`;
  const measuresFromEnd = placement.endsWith('-end');
  if (offset === 'start') return measuresFromEnd ? farEdge : nearEdge;
  return measuresFromEnd ? nearEdge : farEdge;
};

/** Bordered arrow that blends into the surface border. */
export const PopupArrow = ({ arrowSpec, className, ...rest }: PopupArrowProps) => (
  <FloatingArrow
    {...rest}
    width={arrowSpec.width}
    height={arrowSpec.height}
    strokeWidth={1}
    className={classNames(styles.arrow, className)}
  />
);

/** Portal, focus manager, and the floating element. Renders nothing while closed. */
export const FloatingPopupSurface: React.FC<FloatingPopupSurfaceProps> = ({
  context,
  setFloating,
  floatingStyles,
  portalProps,
  focusProps,
  lockScroll = false,
  style,
  children,
  ...rest
}) => {
  if (!context.open) return null;

  const surface = (
    <FloatingFocusManager context={context} modal={false} {...focusProps}>
      <div
        ref={setFloating}
        style={{ ...floatingStyles, ...(lockScroll && { pointerEvents: 'auto' }), ...style }}
        {...rest}
      >
        {children}
      </div>
    </FloatingFocusManager>
  );

  return (
    <FloatingPortal {...portalProps}>
      {lockScroll ? (
        <FloatingOverlay lockScroll style={{ pointerEvents: 'none' }}>
          {surface}
        </FloatingOverlay>
      ) : (
        surface
      )}
    </FloatingPortal>
  );
};

FloatingPopupSurface.displayName = 'FloatingPopupSurface';

/** Surface chrome classes: `wrapper` on the floating element, then `container` and `content`. */
export { styles as popupStyles };

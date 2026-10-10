'use client';

import { ReactNode, useLayoutEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  flip,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import type { ComponentProps, CSSProperties } from 'react';
import type { OpenChangeReason, Placement, ReferenceType } from '@floating-ui/react';
import styles from './Popover.module.scss';

const DEFAULT_ARROW_SIZE = { width: 16, height: 8 };
/** Space between the anchor and the surface, added to the arrow height. */
const FLOATING_GAP = 4;

type FloatingSurfaceProps = {
  /**
   * What the surface is positioned against. Presses on an element anchor don't count as outside
   * presses. A virtual element, such as a cursor point, only positions the surface.
   */
  anchor: ReferenceType | null;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
  placement: Placement;
  /** ARIA role of the surface. */
  role: 'dialog' | 'menu';
  /** Id of the surface. The trigger uses it for `aria-controls`. */
  id: string;
  /**
   * Stops page scroll while the surface is open.
   * The overlay lets presses through so the trigger can still toggle the surface.
   */
  lockScroll?: boolean;
  modal?: boolean;
  portalRoot?: HTMLElement | null;
  hideArrow?: boolean;
  arrowStaticOffset?: string | number | null;
  arrowSize?: { width: number; height: number };
  arrowPadding?: number;
  initialFocus?: ComponentProps<typeof FloatingFocusManager>['initialFocus'];
  /** Applied to the surface. */
  className?: string;
  /** Applied to the padded container inside the surface. */
  containerClassName?: string;
  style?: CSSProperties;
  dataTestId?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

/** Internal Floating UI surface. Positions against `anchor`; the consumer owns the trigger. */
export const FloatingSurface = ({
  anchor,
  children,
  open,
  onOpenChange,
  placement,
  role,
  id,
  lockScroll = false,
  modal = false,
  portalRoot,
  hideArrow = false,
  arrowStaticOffset,
  arrowSize = DEFAULT_ARROW_SIZE,
  arrowPadding = 0,
  initialFocus,
  className,
  containerClassName,
  style: styleProp,
  dataTestId,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: FloatingSurfaceProps) => {
  // Use state so `arrow()` receives the element without reading a ref during render.
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const resolvedPortalRoot = portalRoot ?? undefined;
  const middleware = useMemo(
    () => [
      offset(hideArrow ? FLOATING_GAP : arrowSize.height + FLOATING_GAP),
      // A side placement that fits neither side falls back to below or above the anchor.
      flip({
        boundary: resolvedPortalRoot,
        padding: FLOATING_GAP,
        fallbackAxisSideDirection: 'end',
      }),
      shift({ boundary: resolvedPortalRoot, padding: FLOATING_GAP }),
      // Expose the space left on the chosen side so surface styles can shrink to fit narrow screens.
      size({
        boundary: resolvedPortalRoot,
        padding: FLOATING_GAP,
        apply({ availableWidth, availableHeight, elements }) {
          elements.floating.style.setProperty('--floating-available-width', `${availableWidth}px`);
          elements.floating.style.setProperty(
            '--floating-available-height',
            `${availableHeight}px`
          );
        },
      }),
      arrow({ element: arrowElement, padding: arrowPadding }),
    ],
    [resolvedPortalRoot, hideArrow, arrowSize.height, arrowPadding, arrowElement]
  );
  const {
    refs: { setReference, setFloating },
    context,
    floatingStyles,
  } = useFloating({
    placement,
    open,
    onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware,
  });
  // `elements.reference` only accepts an Element. `setReference` also positions against a virtual one.
  useLayoutEffect(() => {
    setReference(anchor);
  }, [setReference, anchor]);
  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true });
  const { getFloatingProps } = useInteractions([dismiss]);
  const surface = (
    <FloatingFocusManager context={context} modal={modal} initialFocus={initialFocus}>
      <div
        ref={setFloating}
        style={{ ...floatingStyles, pointerEvents: 'auto', ...styleProp }}
        className={classNames(styles.wrapper, className)}
        data-testid={dataTestId}
        {...getFloatingProps()}
        id={id}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {!hideArrow && (
          <FloatingArrow
            ref={setArrowElement}
            context={context}
            height={arrowSize.height}
            width={arrowSize.width}
            strokeWidth={1}
            staticOffset={arrowStaticOffset}
            className={styles.arrow}
          />
        )}
        <div className={classNames(styles.container, containerClassName)}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </FloatingFocusManager>
  );
  return (
    open && (
      <FloatingPortal root={resolvedPortalRoot}>
        {lockScroll ? (
          <FloatingOverlay lockScroll style={{ pointerEvents: 'none' }}>
            {surface}
          </FloatingOverlay>
        ) : (
          surface
        )}
      </FloatingPortal>
    )
  );
};

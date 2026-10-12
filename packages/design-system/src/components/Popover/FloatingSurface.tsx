'use client';

import { cloneElement, isValidElement, ReactNode, Ref, useMemo, useState } from 'react';
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
  useClick,
  useDismiss,
  useFloating,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import type { ComponentProps, CSSProperties } from 'react';
import type {
  OpenChangeReason,
  Placement,
  UseInteractionsReturn,
  UseRoleProps,
} from '@floating-ui/react';
import styles from './Popover.module.scss';

const DEFAULT_ARROW_SIZE = { width: 16, height: 8 };
/**
 * Gap between the anchor and the arrow tip, or the surface when `hideArrow` is set.
 * Also the edge padding for `shift` and `flip`.
 */
const FLOATING_GAP = 4;

const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

type UseFloatingSurfaceOptions = {
  open: boolean;
  onOpenChange: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
  placement: Placement;
  isDisabled?: boolean;
  portalRoot?: HTMLElement | null;
  interactionRole?: UseRoleProps['role'];
  hideArrow?: boolean;
  arrowSize?: { width: number; height: number };
  arrowPadding?: number;
  id?: string;
  /** Positions the surface against this element. When set, no trigger renders. */
  anchor?: Element | null;
};

/**
 * Positioning and base interactions (click, dismiss, role) for `FloatingSurface`.
 * Pass `interactions` to `useInteractions` with any extra hooks that need `context`.
 */
export const useFloatingSurface = ({
  open,
  onOpenChange,
  placement,
  isDisabled,
  portalRoot,
  interactionRole = 'dialog',
  hideArrow = false,
  arrowSize = DEFAULT_ARROW_SIZE,
  arrowPadding = 0,
  id,
  anchor,
}: UseFloatingSurfaceOptions) => {
  // Use state so `arrow()` receives the element without reading a ref during render.
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const resolvedPortalRoot = portalRoot ?? undefined;
  const isAnchored = anchor !== undefined;
  const {
    refs: { setReference, setFloating },
    context,
    floatingStyles,
  } = useFloating({
    placement,
    open,
    onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(hideArrow ? FLOATING_GAP : arrowSize.height + FLOATING_GAP),
      shift({ boundary: resolvedPortalRoot, padding: FLOATING_GAP }),
      flip({ boundary: resolvedPortalRoot, padding: FLOATING_GAP }),
      arrow({ element: arrowElement, padding: arrowPadding }),
    ],
    elements: isAnchored ? { reference: anchor } : undefined,
  });

  const click = useClick(context, { enabled: !isDisabled && !isAnchored });
  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true });
  const generatedRoleInteraction = useRole(context, { role: interactionRole });

  // useRole reads a custom `id` from the surface only after it mounts. Until then, the trigger
  // references the generated ID. Use the custom `id` on both elements from the first render.
  const roleInteraction = useMemo(() => {
    if (id === undefined) return generatedRoleInteraction;

    const { reference, floating } = generatedRoleInteraction;
    return {
      ...generatedRoleInteraction,
      reference: { ...reference, 'aria-controls': reference?.['aria-controls'] && id },
      floating: { ...floating, id },
    };
  }, [generatedRoleInteraction, id]);

  return {
    context,
    setReference,
    setFloating,
    floatingStyles,
    setArrowElement,
    interactions: [click, dismiss, roleInteraction],
    isAnchored,
    isDisabled,
    portalRoot: resolvedPortalRoot,
    hideArrow,
    arrowSize,
  };
};

type FloatingSurfaceProps = {
  surface: ReturnType<typeof useFloatingSurface>;
  interactions: Pick<UseInteractionsReturn, 'getReferenceProps' | 'getFloatingProps'>;
  /** Omit when the surface is anchored with `anchor`. */
  trigger?: ReactNode;
  children: ReactNode;
  /**
   * Stops page scroll while the surface is open.
   * The overlay lets presses through so the trigger can still toggle the surface.
   */
  lockScroll?: boolean;
  modal?: boolean;
  initialFocus?: ComponentProps<typeof FloatingFocusManager>['initialFocus'];
  arrowStaticOffset?: string | number | null;
  /** Applied to the surface. */
  className?: string;
  /** Applied to the padded container inside the surface. */
  containerClassName?: string;
  style?: CSSProperties;
  dataTestId?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

type TriggerElementProps = { style?: CSSProperties; ref?: Ref<unknown>; [key: string]: unknown };

export const FloatingSurface = ({
  surface,
  interactions: { getReferenceProps, getFloatingProps },
  trigger,
  children,
  lockScroll = false,
  modal = false,
  initialFocus,
  arrowStaticOffset,
  className,
  containerClassName,
  style: styleProp,
  dataTestId,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: FloatingSurfaceProps) => {
  const {
    context,
    setReference,
    setFloating,
    floatingStyles,
    setArrowElement,
    isAnchored,
    isDisabled,
    portalRoot,
    hideArrow,
    arrowSize,
  } = surface;

  const childElement = isValidElement<TriggerElementProps>(trigger) ? trigger : null;
  const mergedRef = useMergeRefs([setReference, childElement?.props.ref ?? null]);
  const triggerStyle = isDisabled ? DISABLED_TRIGGER_STYLE : ENABLED_TRIGGER_STYLE;

  // Add ARIA attributes to a single trigger element. Otherwise, use a button-role wrapper.
  const triggerElement =
    !isAnchored &&
    (childElement ? (
      cloneElement(
        childElement,
        getReferenceProps({
          ...childElement.props,
          ref: mergedRef,
          // Element triggers keep their own display, and their own style wins over the cursor.
          style: { cursor: isDisabled ? 'default' : 'pointer', ...childElement.props.style },
        })
      )
    ) : (
      <span
        ref={setReference}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        style={triggerStyle}
        {...getReferenceProps()}
      >
        {trigger}
      </span>
    ));

  const surfaceElement = (
    <FloatingFocusManager context={context} modal={modal} initialFocus={initialFocus}>
      <div
        ref={setFloating}
        style={{ ...floatingStyles, pointerEvents: 'auto', ...styleProp }}
        className={classNames(styles.wrapper, className)}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        {...getFloatingProps()}
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

  const floatingElement = context.open && (
    <FloatingPortal root={portalRoot}>
      {lockScroll ? (
        <FloatingOverlay lockScroll style={{ pointerEvents: 'none' }}>
          {surfaceElement}
        </FloatingOverlay>
      ) : (
        surfaceElement
      )}
    </FloatingPortal>
  );

  return (
    <>
      {triggerElement}
      {floatingElement}
    </>
  );
};

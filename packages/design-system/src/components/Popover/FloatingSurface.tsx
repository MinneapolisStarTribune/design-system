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
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import type { ComponentProps, CSSProperties } from 'react';
import type { OpenChangeReason, Placement, UseRoleProps } from '@floating-ui/react';
import styles from './Popover.module.scss';

const DEFAULT_ARROW_SIZE = { width: 16, height: 8 };
/** Space between the anchor and the surface, added to the arrow height. */
const FLOATING_GAP = 4;

const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

type FloatingSurfaceBaseProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
  placement: Placement;
  /**
   * Stops page scroll while the surface is open.
   * The overlay lets presses through so the trigger can still toggle the surface.
   */
  lockScroll?: boolean;
  isDisabled?: boolean;
  modal?: boolean;
  portalRoot?: HTMLElement | null;
  /** Role that Floating UI sets on the trigger and surface. */
  interactionRole?: UseRoleProps['role'];
  hideArrow?: boolean;
  arrowStaticOffset?: string | number | null;
  arrowSize?: { width: number; height: number };
  arrowPadding?: number;
  initialFocus?: ComponentProps<typeof FloatingFocusManager>['initialFocus'];
  /** Applied to the surface. */
  className?: string;
  /** Applied to the padded container inside the surface. */
  containerClassName?: string;
  id?: string;
  style?: CSSProperties;
  dataTestId?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

type TriggerSurfaceProps = FloatingSurfaceBaseProps & { trigger: ReactNode; anchorEl?: never };
type AnchoredSurfaceProps = FloatingSurfaceBaseProps & {
  anchorEl: Element | null;
  trigger?: never;
};

type TriggerElementProps = { style?: CSSProperties; ref?: Ref<unknown>; [key: string]: unknown };

/** Internal Floating UI surface. */
export const FloatingSurface = ({
  trigger,
  anchorEl,
  children,
  open,
  onOpenChange,
  placement,
  lockScroll = false,
  isDisabled,
  modal = false,
  portalRoot,
  interactionRole = 'dialog',
  hideArrow = false,
  arrowStaticOffset,
  arrowSize = DEFAULT_ARROW_SIZE,
  arrowPadding = 0,
  initialFocus,
  className,
  containerClassName,
  id,
  style: styleProp,
  dataTestId,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: TriggerSurfaceProps | AnchoredSurfaceProps) => {
  // Use state so `arrow()` receives the element without reading a ref during render.
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const resolvedPortalRoot = portalRoot ?? undefined;
  const isAnchored = anchorEl !== undefined;
  const middleware = useMemo(
    () => [
      offset(hideArrow ? FLOATING_GAP : arrowSize.height + FLOATING_GAP),
      shift({ boundary: resolvedPortalRoot, padding: FLOATING_GAP }),
      flip({ boundary: resolvedPortalRoot, padding: FLOATING_GAP }),
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
    elements: isAnchored ? { reference: anchorEl } : undefined,
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
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    roleInteraction,
  ]);
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
  const surface = (
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
  const floatingElement = open && (
    <FloatingPortal root={resolvedPortalRoot}>
      {lockScroll ? (
        <FloatingOverlay lockScroll style={{ pointerEvents: 'none' }}>
          {surface}
        </FloatingOverlay>
      ) : (
        surface
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

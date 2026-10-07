'use client';

import { cloneElement, isValidElement, ReactNode, Ref, useMemo, useState } from 'react';
import classNames from 'classnames';
import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingFocusManager,
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
import type { CSSProperties } from 'react';
import type { OpenChangeReason, Placement } from '@floating-ui/react';
import styles from './Popover.module.scss';

const ARROW_WIDTH = 16;
const ARROW_HEIGHT = 8;
/** Space between the anchor and the surface, added to the arrow height. */
const FLOATING_GAP = 4;

const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

type FloatingSurfaceProps = {
  trigger: ReactNode;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
  placement: Placement;
  /** Keeps the surface in the DOM, hidden, while closed. */
  keepMounted?: boolean;
  isDisabled?: boolean;
  modal?: boolean;
  portalRoot?: HTMLElement | null;
  className?: string;
  id?: string;
  style?: CSSProperties;
  dataTestId?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

type TriggerElementProps = { style?: CSSProperties; ref?: Ref<unknown>; [key: string]: unknown };

/** Internal Floating UI surface. */
export const FloatingSurface = ({
  trigger,
  children,
  open,
  onOpenChange,
  placement,
  keepMounted = false,
  isDisabled,
  modal = false,
  portalRoot,
  className,
  id,
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
      offset(ARROW_HEIGHT + FLOATING_GAP),
      shift({ boundary: resolvedPortalRoot, padding: FLOATING_GAP }),
      flip({ boundary: resolvedPortalRoot, padding: FLOATING_GAP }),
      arrow({ element: arrowElement }),
    ],
    [resolvedPortalRoot, arrowElement]
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
  const click = useClick(context, { enabled: !isDisabled });
  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true });
  const generatedRoleInteraction = useRole(context, { role: 'dialog' });
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
  const triggerElement = childElement ? (
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
  );

  const floatingElement = (open || keepMounted) && (
    <FloatingPortal root={resolvedPortalRoot}>
      <FloatingFocusManager context={context} modal={modal} disabled={!open}>
        <div
          ref={setFloating}
          data-state={open ? 'open' : 'closed'}
          style={
            open ? { ...floatingStyles, ...styleProp } : { ...floatingStyles, display: 'none' }
          }
          className={classNames(styles.wrapper, className)}
          data-testid={dataTestId}
          aria-label={ariaLabel}
          {...getFloatingProps()}
          aria-labelledby={ariaLabelledBy}
        >
          <FloatingArrow
            ref={setArrowElement}
            context={context}
            height={ARROW_HEIGHT}
            width={ARROW_WIDTH}
            strokeWidth={1}
            className={styles.arrow}
          />
          <div className={styles.container}>
            <div className={styles.content}>{children}</div>
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );

  return (
    <>
      {triggerElement}
      {floatingElement}
    </>
  );
};

'use client';

import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useMemo,
  useState,
} from 'react';
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
import type { ComponentProps, HTMLAttributes } from 'react';
import type { OffsetOptions, OpenChangeReason, Placement, UseRoleProps } from '@floating-ui/react';
import styles from './Popover.module.scss';

const DEFAULT_ARROW_SIZE = { width: 16, height: 8 };
/** Space between the anchor and the surface, added to the arrow height. */
export const FLOATING_GAP = 4;

const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

type FloatingSurfaceBaseProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
  placement: Placement;
  /** Replaces the default offset. The default uses `FLOATING_GAP` after the arrow. */
  offset?: OffsetOptions;
  /**
   * Moves the surface on the cross axis to keep it on screen.
   * Use this when the surface covers its anchor because `flip` has no effect.
   */
  shiftCrossAxis?: boolean;
  /**
   * Stops page scroll while the surface is open.
   * A transparent overlay closes the surface and blocks the press below it.
   */
  lockScroll?: boolean;
  isDisabled?: boolean;
  modal?: boolean;
  portalRoot?: HTMLElement | null;
  /** Role that Floating UI sets on the trigger and surface. `role` changes only the surface. */
  interactionRole?: UseRoleProps['role'];
  hideArrow?: boolean;
  arrowStaticOffset?: string | number | null;
  arrowSize?: { width: number; height: number };
  arrowPadding?: number;
  initialFocus?: ComponentProps<typeof FloatingFocusManager>['initialFocus'];
  wrapperClassName?: string;
  containerClassName?: string;
  contentClassName?: string;
  arrowClassName?: string;
  'aria-label'?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'children'>;

type TriggerSurfaceProps = FloatingSurfaceBaseProps & { trigger: ReactNode; anchorEl?: never };
type AnchoredSurfaceProps = FloatingSurfaceBaseProps & {
  anchorEl: Element | null;
  trigger?: never;
};

/** Internal Floating UI surface. */
export const FloatingSurface = ({
  trigger,
  anchorEl,
  children,
  open,
  onOpenChange,
  placement,
  offset: offsetOptions,
  shiftCrossAxis = false,
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
  wrapperClassName,
  containerClassName,
  contentClassName,
  arrowClassName,
  style: styleProp,
  'aria-label': ariaLabel,
  ...rest
}: TriggerSurfaceProps | AnchoredSurfaceProps) => {
  // Use state so `arrow()` receives the element without reading a ref during render.
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  // Callers resolve the portal root. Reading context here would use Popover's nested provider.
  const resolvedPortalRoot = portalRoot ?? undefined;
  const isAnchored = anchorEl !== undefined;
  const middleware = useMemo(
    () => [
      offset(offsetOptions ?? (hideArrow ? FLOATING_GAP : arrowSize.height + FLOATING_GAP)),
      shift({
        boundary: resolvedPortalRoot,
        padding: FLOATING_GAP,
        crossAxis: shiftCrossAxis,
      }),
      flip({ boundary: resolvedPortalRoot, padding: FLOATING_GAP }),
      arrow({ element: arrowElement, padding: arrowPadding }),
    ],
    [
      offsetOptions,
      shiftCrossAxis,
      resolvedPortalRoot,
      hideArrow,
      arrowSize.height,
      arrowPadding,
      arrowElement,
    ]
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
  const roleInteraction = useRole(context, { role: interactionRole });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    roleInteraction,
  ]);
  const isDarkTheme =
    typeof document !== 'undefined' &&
    (document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.body.classList.contains('sb-dark'));
  const arrowFill = isDarkTheme
    ? 'var(--color-background-dark-gray-01)'
    : 'var(--color-base-white)';
  const arrowStroke = isDarkTheme
    ? 'var(--color-border-on-dark-subtle-01)'
    : 'var(--color-border-on-light-subtle-01)';
  const childElement = isValidElement(trigger)
    ? (trigger as ReactElement<Record<string, unknown>> & { ref?: React.Ref<unknown> })
    : null;
  const mergedRef = useMergeRefs([setReference, childElement?.ref ?? null]);
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
          style: childElement.props.style
            ? { ...childElement.props.style, ...triggerStyle }
            : triggerStyle,
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
        style={{ ...floatingStyles, ...styleProp }}
        className={classNames(styles.wrapper, wrapperClassName)}
        aria-label={ariaLabel}
        {...getFloatingProps()}
        {...rest}
      >
        {!hideArrow && (
          <FloatingArrow
            ref={setArrowElement}
            context={context}
            height={arrowSize.height}
            width={arrowSize.width}
            fill={arrowFill}
            stroke={arrowStroke}
            strokeWidth={1}
            staticOffset={arrowStaticOffset}
            className={classNames(styles.arrow, arrowClassName)}
          />
        )}
        <div className={classNames(styles.container, containerClassName)}>
          <div className={classNames(styles.content, contentClassName)}>{children}</div>
        </div>
      </div>
    </FloatingFocusManager>
  );
  const floatingElement = open && (
    <FloatingPortal root={resolvedPortalRoot}>
      {lockScroll ? <FloatingOverlay lockScroll>{surface}</FloatingOverlay> : surface}
    </FloatingPortal>
  );
  return (
    <>
      {triggerElement}
      {floatingElement}
    </>
  );
};

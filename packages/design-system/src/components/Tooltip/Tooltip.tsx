'use client';

import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useContext,
  useId,
  useMemo,
  useRef,
} from 'react';
import classNames from 'classnames';
import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingPortal,
  useClick,
  useDismiss,
  flip,
  offset,
  shift,
  useFocus,
  useFloating,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import styles from './Tooltip.module.scss';
import { TooltipProps } from './Tooltip.types';
import { TooltipPortalRootContext, TooltipPortalRootProvider } from './TooltipContext';

const ARROW_WIDTH = 12;
const ARROW_HEIGHT = 6;
const GAP = 0;

const TooltipRoot: React.FC<TooltipProps> = ({
  children,
  label,
  pointer = 'top',
  icon,
  iconPosition = 'start',
  isDisabled,
  portalRoot: portalRootProp,
  showDelay = 200,
  hideDelay = 0,
  wrapperClassName,
  contentClassName,
  arrowClassName,
  labelClassName,
  iconClassName,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const [open, setOpen] = React.useState(false);
  const responsiveSize = useResponsiveSize();
  const isTouchDevice = responsiveSize === 'medium';
  const arrowRef = useRef<SVGSVGElement>(null);
  const tooltipId = useId();

  const portalRootFromContext = useContext(TooltipPortalRootContext);
  const resolvedPortalRoot = portalRootProp ?? portalRootFromContext ?? undefined;

  const middleware = useMemo(
    () => [
      offset(ARROW_HEIGHT + GAP),
      shift({ boundary: resolvedPortalRoot, padding: GAP }),
      flip({ boundary: resolvedPortalRoot, padding: GAP }),
      // eslint-disable-next-line react-hooks/refs
      arrow({ element: arrowRef }),
    ],
    [resolvedPortalRoot]
  );

  const { refs, context, floatingStyles } = useFloating({
    placement: pointer,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  const hover = useHover(context, {
    enabled: !isDisabled && !isTouchDevice,
    delay: { open: showDelay, close: hideDelay },
  });
  const focus = useFocus(context, { enabled: !isDisabled });
  const click = useClick(context, {
    enabled: !isDisabled && isTouchDevice,
    event: 'click',
  });
  const dismiss = useDismiss(context, { enabled: !isDisabled });
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
    role,
  ]);

  const childElement = isValidElement(children)
    ? (children as ReactElement<Record<string, unknown>> & { ref?: React.Ref<unknown> })
    : null;

  const mergedRef = useMergeRefs([refs.setReference, childElement?.ref ?? null]);

  // Clone the child element and apply tooltip trigger props
  const triggerElement = childElement ? (
    cloneElement(
      childElement,
      getReferenceProps({
        ...childElement.props,
        ref: mergedRef,
        'aria-describedby': `tooltip-${tooltipId}`,
      })
    )
  ) : (
    <span
      ref={refs.setReference}
      tabIndex={0}
      {...getReferenceProps()}
      aria-describedby={`tooltip-${tooltipId}`}
    >
      {children}
    </span>
  );

  // Determine icon position (render at start or end of JSX)
  const startIcon = icon && iconPosition === 'start' ? icon : null;
  const endIcon = icon && iconPosition === 'end' ? icon : null;

  return (
    <TooltipPortalRootProvider>
      {triggerElement}
      {open && !isDisabled && (
        <FloatingPortal root={resolvedPortalRoot}>
          <div
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={floatingStyles}
            className={classNames(styles.wrapper, wrapperClassName)}
            role="tooltip"
            id={`tooltip-${tooltipId}`}
            aria-label={ariaLabel}
            {...getFloatingProps()}
            {...rest}
          >
            <FloatingArrow
              ref={arrowRef}
              context={context}
              height={ARROW_HEIGHT}
              width={ARROW_WIDTH}
              fill="var(--color-background-dark-gray-02)"
              strokeWidth={0}
              className={classNames(styles.arrow, arrowClassName)}
            />
            <div className={classNames(styles.container)}>
              <div className={classNames(styles.content, contentClassName)}>
                {startIcon && (
                  <span className={classNames(styles.icon, iconClassName)}>{startIcon}</span>
                )}
                <span
                  className={classNames(
                    styles.label,
                    'typography-utility-text-regular-x-small',
                    labelClassName
                  )}
                >
                  {label}
                </span>
                {endIcon && (
                  <span className={classNames(styles.icon, iconClassName)}>{endIcon}</span>
                )}
              </div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </TooltipPortalRootProvider>
  );
};

export const Tooltip = TooltipRoot;

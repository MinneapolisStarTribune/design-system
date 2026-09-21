'use client';

import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
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
import {
  TooltipCloseContext,
  TooltipPortalRootContext,
  TooltipPortalRootProvider,
} from './TooltipContext';

const ARROW_WIDTH = 12;
const ARROW_HEIGHT = 6;
const GAP = 0;

const TooltipRoot: React.FC<TooltipProps> = ({
  children,
  label,
  content,
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
  zIndex = 9999,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  dismissible = true,
  ...rest
}) => {
  const [openState, setOpenState] = useState(false);
  const responsiveSize = useResponsiveSize();
  const isTouchDevice = responsiveSize === 'medium';
  const arrowRef = useRef<SVGSVGElement>(null);
  const tooltipId = useId();

  // Rich `content` implies click-triggered, interactive content (links, a dismiss button) — a
  // hover/focus-revealed `role="tooltip"` element must never contain focusable content, so this
  // switches both the interaction model and the ARIA role. Plain `label` stays a passive hint.
  const isRichContent = content !== undefined;

  const portalRootFromContext = useContext(TooltipPortalRootContext);
  const resolvedPortalRoot = portalRootProp ?? portalRootFromContext ?? undefined;

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isDisabled && nextOpen) return;
      if (!isControlled) setOpenState(nextOpen);
      onOpenChangeProp?.(nextOpen);
    },
    [isDisabled, isControlled, onOpenChangeProp]
  );

  const close = useCallback(() => handleOpenChange(false), [handleOpenChange]);

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
    onOpenChange: handleOpenChange,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  const hover = useHover(context, {
    enabled: !isDisabled && !isTouchDevice && !isRichContent,
    delay: { open: showDelay, close: hideDelay },
  });
  const focus = useFocus(context, { enabled: !isDisabled && !isRichContent });
  const click = useClick(context, {
    enabled: !isDisabled && (isRichContent || isTouchDevice),
    event: 'click',
  });
  const dismiss = useDismiss(context, { enabled: !isDisabled && dismissible });
  const role = useRole(context, { role: isRichContent ? 'dialog' : 'tooltip' });

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

  const closeContextValue = useMemo(() => ({ close }), [close]);

  return (
    <TooltipPortalRootProvider>
      {triggerElement}
      {open && !isDisabled && (
        <FloatingPortal root={resolvedPortalRoot}>
          <div
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex }}
            className={classNames(styles.wrapper, wrapperClassName)}
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
                {isRichContent ? (
                  <TooltipCloseContext.Provider value={closeContextValue}>
                    {content}
                  </TooltipCloseContext.Provider>
                ) : (
                  <>
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
                  </>
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

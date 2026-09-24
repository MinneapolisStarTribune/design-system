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
} from 'react';
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
import { useExternalTrigger } from '@/hooks/useExternalTrigger';
import styles from '../Popover/Popover.module.scss';
import { PopoverBody } from '../Popover/PopoverBody';
import {
  PopoverContext,
  PopoverPortalRootContext,
  PopoverPortalRootProvider,
} from '../Popover/PopoverContext';
import { PopoverDescription } from '../Popover/PopoverDescription';
import { PopoverDivider } from '../Popover/PopoverDivider';
import { PopoverHeading } from '../Popover/PopoverHeading';
import { TriggerablePopoverProps } from './TriggerablePopover.types';

const ARROW_HEIGHT = 8;
const GAP = 4;

const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

const TriggerablePopoverRoot: React.FC<TriggerablePopoverProps> = ({
  trigger,
  children,
  triggerId,
  enableInjectionSlot = false,
  placement = 'bottom',
  isDisabled,
  modal = false,
  wrapperClassName,
  containerClassName,
  contentClassName,
  arrowClassName,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  portalRoot: portalRootProp,
  'aria-label': ariaLabel,
  externalTriggerOptions,
  ...rest
}) => {
  const arrowRef = useRef<SVGSVGElement>(null);
  const headingId = useId();

  const portalRootFromContext = useContext(PopoverPortalRootContext);
  const resolvedPortalRoot = portalRootProp ?? portalRootFromContext ?? undefined;

  const { open, handleOpenChange, isExternallyTriggered, forceMount, injectionSlotProps } =
    useExternalTrigger(triggerId, openProp, onOpenChangeProp, {
      ...externalTriggerOptions,
      enableInjectionSlot,
    });

  const guardedHandleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isDisabled && nextOpen) return;
      handleOpenChange(nextOpen);
    },
    [isDisabled, handleOpenChange]
  );

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
    placement,
    open,
    onOpenChange: guardedHandleOpenChange,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  const click = useClick(context, { enabled: !isDisabled });
  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true });
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const close = useCallback(() => handleOpenChange(false), [handleOpenChange]);

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

  const mergedRef = useMergeRefs([refs.setReference, childElement?.ref ?? null]);

  const triggerStyle = isDisabled ? DISABLED_TRIGGER_STYLE : ENABLED_TRIGGER_STYLE;

  const triggerElement = childElement ? (
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
      ref={refs.setReference}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      style={triggerStyle}
      {...getReferenceProps()}
    >
      {trigger}
    </span>
  );

  const contextValue = useMemo(() => ({ close }), [close]);

  return (
    <PopoverPortalRootProvider>
      <PopoverContext.Provider value={contextValue}>
        {triggerElement}
        {(open || forceMount) && (
          <FloatingPortal root={resolvedPortalRoot}>
            <FloatingFocusManager context={context} modal={modal} disabled={!open}>
              <div
                // eslint-disable-next-line react-hooks/refs
                ref={refs.setFloating}
                data-state={open ? 'open' : 'closed'}
                style={open ? floatingStyles : { ...floatingStyles, display: 'none' }}
                className={classNames(styles.wrapper, wrapperClassName)}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabel ? undefined : `popover-heading-${headingId}`}
                {...getFloatingProps()}
                {...rest}
              >
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  height={ARROW_HEIGHT}
                  width={16}
                  fill={arrowFill}
                  stroke={arrowStroke}
                  strokeWidth={1}
                  className={classNames(styles.arrow, arrowClassName)}
                />
                <div className={classNames(styles.container, containerClassName)}>
                  <div className={classNames(styles.content, contentClassName)}>
                    {!isExternallyTriggered && children}
                    {injectionSlotProps && <div {...injectionSlotProps} />}
                  </div>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </PopoverContext.Provider>
    </PopoverPortalRootProvider>
  );
};

/* Compound API — reuses Popover's sub-components directly; they only depend on PopoverContext. */

type TriggerablePopoverComponent = React.FC<TriggerablePopoverProps> & {
  Heading: typeof PopoverHeading;
  Description: typeof PopoverDescription;
  Body: typeof PopoverBody;
  Divider: typeof PopoverDivider;
};

/**
 * @deprecated Use `Popover` instead — it supports the same controlled `open`/`onOpenChange`
 * composition (drive `open` from whatever external trigger source you like, e.g.
 * `@minneapolisstartribune/external-trigger`) plus a `Popover.ExternalContent` sub-component for
 * fixed icon/heading/description/dismiss content, without this component's iframe-injection-slot
 * machinery or maintaining two near-duplicate popover implementations. This component is kept for
 * existing consumers; it isn't being changed further.
 */
export const TriggerablePopover = TriggerablePopoverRoot as TriggerablePopoverComponent;

TriggerablePopover.Heading = PopoverHeading;
TriggerablePopover.Body = PopoverBody;
TriggerablePopover.Description = PopoverDescription;
TriggerablePopover.Divider = PopoverDivider;

'use client';

import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react';
import { Button } from '@/components/Button/web/Button';
import { CloseIcon } from '@/icons';
import { createDesignSystemError } from '@/utils/errorPrefix';
import styles from './Drawer.module.scss';
import { DrawerBody } from './DrawerBody';
import { DrawerContext } from './DrawerContext';
import { DrawerDescription } from './DrawerDescription';
import { DrawerFooter } from './DrawerFooter';
import { DrawerHeading } from './DrawerHeading';
import type { DrawerProps } from './Drawer.types';

// Keep in sync with the transition durations in Drawer.module.scss.
const ENTER_DURATION = 250;
const EXIT_DURATION = 200;

const TRIGGER_WRAPPER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;
// Overrides FloatingOverlay's inline `overflow: auto` so the off-screen panel doesn't add scroll.
const OVERLAY_STYLE = { overflow: 'hidden' } as const;

const DrawerRoot: React.FC<DrawerProps> = ({
  children,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  position = 'right',
  mobilePosition,
  isDismissable = true,
  showCloseButton = true,
  closeButtonLabel = 'Close',
  initialFocus,
  portalRoot,
  className,
  overlayClassName,
  contentClassName,
  style,
  dataTestId = 'drawer',
  'aria-label': ariaLabel,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [hasHeading, setHasHeadingState] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  // Read by the dev-only name check, which runs outside of render.
  const hasHeadingRef = useRef(false);

  const setHasHeading = useCallback((nextHasHeading: boolean) => {
    hasHeadingRef.current = nextHasHeading;
    setHasHeadingState(nextHasHeading);
  }, []);

  const instanceId = useId();
  const headingId = `drawer-heading-${instanceId}`;
  const descriptionId = `drawer-description-${instanceId}`;

  const resolvedMobilePosition = mobilePosition ?? position;

  // Support controlled and uncontrolled modes
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(nextOpen);
      onOpenChangeProp?.(nextOpen);
    },
    [isControlled, onOpenChangeProp]
  );

  // No middleware: the drawer is pinned to a viewport edge, not positioned against the trigger.
  const { refs, context } = useFloating({ open, onOpenChange: handleOpenChange });

  const click = useClick(context, { enabled: trigger !== undefined });
  const dismiss = useDismiss(context, { enabled: isDismissable });
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const { isMounted, status } = useTransitionStatus(context, {
    duration: { open: ENTER_DURATION, close: EXIT_DURATION },
  });

  const close = useCallback(() => handleOpenChange(false), [handleOpenChange]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (!isMounted || ariaLabel) return;

    // Portal children (including Drawer.Heading) commit after this effect, so check a tick later.
    const timeoutId = setTimeout(() => {
      if (hasHeadingRef.current) return;

      console.warn(
        createDesignSystemError(
          'Drawer',
          'Add a <Drawer.Heading> or an `aria-label` so the drawer has an accessible name.'
        )
      );
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [ariaLabel, isMounted]);

  const triggerElement = isValidElement(trigger)
    ? (trigger as ReactElement<Record<string, unknown>> & { ref?: React.Ref<unknown> })
    : null;

  const mergedTriggerRef = useMergeRefs([refs.setReference, triggerElement?.ref ?? null]);

  // Put reference props on the trigger when it's a single element; otherwise wrap it, like Popover.
  const renderedTrigger = triggerElement ? (
    cloneElement(
      triggerElement,
      getReferenceProps({ ...triggerElement.props, ref: mergedTriggerRef })
    )
  ) : trigger !== undefined ? (
    <span
      ref={refs.setReference}
      role="button"
      tabIndex={0}
      style={TRIGGER_WRAPPER_STYLE}
      {...getReferenceProps()}
    >
      {trigger}
    </span>
  ) : null;

  const contextValue = useMemo(
    () => ({ close, descriptionId, headingId, setHasDescription, setHasHeading }),
    [close, descriptionId, headingId, setHasHeading]
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {renderedTrigger}

      {isMounted && (
        <FloatingPortal root={portalRoot ?? undefined}>
          <FloatingOverlay
            lockScroll
            data-status={status}
            data-testid={`${dataTestId}-overlay`}
            style={OVERLAY_STYLE}
            className={classNames(
              styles.overlay,
              styles[`position-${position}`],
              styles[`mobile-position-${resolvedMobilePosition}`],
              overlayClassName
            )}
          >
            <FloatingFocusManager
              context={context}
              modal
              // Focus the panel by default so screen readers announce the drawer's name first.
              // eslint-disable-next-line react-hooks/refs
              initialFocus={initialFocus ?? refs.floating}
            >
              <div
                // eslint-disable-next-line react-hooks/refs
                ref={refs.setFloating}
                {...getFloatingProps()}
                aria-label={ariaLabel}
                aria-labelledby={!ariaLabel && hasHeading ? headingId : undefined}
                aria-describedby={hasDescription ? descriptionId : undefined}
                aria-modal="true"
                className={classNames(styles.panel, className)}
                data-position={position}
                data-mobile-position={resolvedMobilePosition}
                data-status={status}
                data-testid={dataTestId}
                style={style}
              >
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="small"
                    icon={<CloseIcon />}
                    aria-label={closeButtonLabel}
                    className={styles.closeButton}
                    dataTestId={`${dataTestId}-close-button`}
                    onClick={close}
                  />
                )}

                <div
                  className={classNames(
                    styles.content,
                    showCloseButton && styles.withCloseButton,
                    contentClassName
                  )}
                >
                  {children}
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </DrawerContext.Provider>
  );
};

DrawerRoot.displayName = 'Drawer';

/* Compound API */

type DrawerComponent = React.FC<DrawerProps> & {
  Heading: typeof DrawerHeading;
  Description: typeof DrawerDescription;
  Body: typeof DrawerBody;
  Footer: typeof DrawerFooter;
};

export const Drawer = DrawerRoot as DrawerComponent;

Drawer.Heading = DrawerHeading;
Drawer.Description = DrawerDescription;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;

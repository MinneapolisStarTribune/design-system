'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
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

// Overrides FloatingOverlay's inline `overflow: auto` so the off-screen panel doesn't add scroll.
const OVERLAY_STYLE = { overflow: 'hidden' } as const;

const DrawerRoot: React.FC<DrawerProps> = ({
  children,
  open,
  onClose,
  position = 'right',
  mobilePosition = 'bottom',
  isDismissable = true,
  showCloseButton = true,
  initialFocus,
  portalRoot,
  className,
  style,
  dataTestId = 'drawer',
  'aria-label': ariaLabel,
}) => {
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

  // No middleware: the drawer is pinned to a viewport edge, not positioned against an element.
  const { refs, context } = useFloating({
    open,
    onOpenChange: (nextOpen) => {
      if (!nextOpen) onClose();
    },
  });

  const dismiss = useDismiss(context, { enabled: isDismissable });
  const role = useRole(context, { role: 'dialog' });

  const { getFloatingProps } = useInteractions([dismiss, role]);

  const { isMounted, status } = useTransitionStatus(context, {
    duration: { open: ENTER_DURATION, close: EXIT_DURATION },
  });

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

  const contextValue = useMemo(
    () => ({ descriptionId, headingId, setHasDescription, setHasHeading }),
    [descriptionId, headingId, setHasHeading]
  );

  return (
    <DrawerContext.Provider value={contextValue}>
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
              styles[`mobile-position-${mobilePosition}`]
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
                data-mobile-position={mobilePosition}
                data-status={status}
                data-testid={dataTestId}
                style={style}
              >
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="small"
                    icon={<CloseIcon />}
                    aria-label="Close"
                    className={styles.closeButton}
                    dataTestId={`${dataTestId}-close-button`}
                    onClick={onClose}
                  />
                )}

                <div
                  className={classNames(styles.content, showCloseButton && styles.withCloseButton)}
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

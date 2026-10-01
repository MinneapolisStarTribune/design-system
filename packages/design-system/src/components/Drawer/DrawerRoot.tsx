'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  type OpenChangeReason,
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
import { useResponsiveValue } from '@/hooks/useResponsiveValue';
import { CloseIcon } from '@/icons';
import type { Responsive } from '@/types/globalTypes';
import { createDesignSystemError } from '@/utils/errorPrefix';
import styles from './Drawer.module.scss';
import { DrawerContext } from './DrawerContext';
import type { DrawerCloseReason, DrawerPosition, DrawerProps } from './Drawer.types';

// Keep in sync with the transition durations in Drawer.module.scss.
const ENTER_DURATION = 250;
const EXIT_DURATION = 200;
// Matches the 1ms reduced-motion transitions, so the modal unmounts once the drawer is hidden.
const REDUCED_MOTION_DURATION = 1;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Overrides FloatingOverlay's inline `overflow: auto` so the off-screen panel doesn't add scroll.
const OVERLAY_STYLE = { overflow: 'hidden' } as const;

// A bottom sheet on phones, a right side panel from 768px up.
const DEFAULT_POSITION: Responsive<DrawerPosition> = { small: 'bottom', medium: 'right' };

// useDismiss only closes on Escape and outside (overlay) presses.
const CLOSE_REASONS: Partial<Record<OpenChangeReason, DrawerCloseReason>> = {
  'escape-key': 'escapeKey',
  'outside-press': 'overlayPress',
};

export const DrawerRoot: React.FC<DrawerProps> = ({
  children,
  open,
  onClose,
  position,
  showCloseButton = true,
  role = 'dialog',
  describeWithBody = role === 'alertdialog',
  closeLabel = 'Close',
  initialFocus,
  portalRoot,
  className,
  style,
  dataTestId = 'drawer',
  'aria-label': ariaLabel,
}) => {
  const [hasHeading, setHasHeadingState] = useState(false);
  // Read by the dev-only name check, which runs outside of render.
  const hasHeadingRef = useRef(false);
  const [hasBody, setHasBody] = useState(false);

  const setHasHeading = useCallback((nextHasHeading: boolean) => {
    hasHeadingRef.current = nextHasHeading;
    setHasHeadingState(nextHasHeading);
  }, []);

  const resolvedPosition = useResponsiveValue(position, DEFAULT_POSITION);

  const instanceId = useId();
  const headingId = `drawer-heading-${instanceId}`;
  const bodyId = `drawer-body-${instanceId}`;

  // No middleware: the drawer is pinned to a viewport edge, not positioned against an element.
  const {
    refs: { floating, setFloating },
    context,
  } = useFloating({
    open,
    onOpenChange: (nextOpen, _event, reason) => {
      const closeReason = reason && CLOSE_REASONS[reason];

      if (!nextOpen && closeReason) onClose(closeReason);
    },
  });

  const dismiss = useDismiss(context);
  const roleProps = useRole(context, { role });

  const { getFloatingProps } = useInteractions([dismiss, roleProps]);

  const { isMounted, status } = useTransitionStatus(context, {
    duration: prefersReducedMotion()
      ? REDUCED_MOTION_DURATION
      : { open: ENTER_DURATION, close: EXIT_DURATION },
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
          'Add a <Drawer.Heading> (or <Dialog.Title>) or an `aria-label` so it has an accessible name.'
        )
      );
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [ariaLabel, isMounted]);

  const contextValue = useMemo(
    () => ({ headingId, setHasHeading, bodyId, setHasBody }),
    [headingId, setHasHeading, bodyId]
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
            className={classNames(styles.overlay, styles[`position-${resolvedPosition}`])}
          >
            <FloatingFocusManager
              context={context}
              modal
              // Focus the panel by default so screen readers announce the drawer's name first.
              initialFocus={initialFocus ?? floating}
            >
              <div
                ref={setFloating}
                {...getFloatingProps()}
                aria-label={ariaLabel}
                aria-labelledby={!ariaLabel && hasHeading ? headingId : undefined}
                aria-describedby={describeWithBody && hasBody ? bodyId : undefined}
                aria-modal="true"
                className={classNames(styles.panel, className)}
                data-status={status}
                data-testid={dataTestId}
                style={style}
              >
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="small"
                    icon={<CloseIcon />}
                    aria-label={closeLabel}
                    className={styles.closeButton}
                    dataTestId={`${dataTestId}-close-button`}
                    onClick={() => onClose('closeButton')}
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

DrawerRoot.displayName = 'Drawer.Root';

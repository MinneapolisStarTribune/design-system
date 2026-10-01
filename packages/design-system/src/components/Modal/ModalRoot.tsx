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
import { CloseIcon } from '@/icons';
import { createDesignSystemError } from '@/utils/errorPrefix';
import styles from './Modal.module.scss';
import { ModalContext } from './ModalContext';
import type { ModalCloseReason, ModalRootProps } from './Modal.types';

// Keep in sync with the transition durations in Modal.module.scss.
const ENTER_DURATION = 250;
const EXIT_DURATION = 200;
// Matches the 1ms reduced-motion transitions, so the modal unmounts once the panel is hidden.
const REDUCED_MOTION_DURATION = 1;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Overrides FloatingOverlay's inline `overflow: auto` so the off-screen panel doesn't add scroll.
const OVERLAY_STYLE = { overflow: 'hidden' } as const;

// useDismiss only closes on Escape and outside (overlay) presses.
const CLOSE_REASONS: Partial<Record<OpenChangeReason, ModalCloseReason>> = {
  'escape-key': 'escapeKey',
  'outside-press': 'overlayPress',
};

/**
 * Internal base for `Drawer.Root` and `Dialog.Root`: the overlay, panel and close button, plus
 * focus trapping, scroll locking, dismissal, the accessible name and description, and the
 * enter/exit transition. Callers resolve `position` and own their public props and defaults.
 */
export const ModalRoot: React.FC<ModalRootProps> = ({
  children,
  open,
  onClose,
  position,
  showCloseButton = true,
  role = 'dialog',
  describeWithBody,
  closeLabel = 'Close',
  initialFocus,
  portalRoot,
  className,
  style,
  dataTestId,
  'aria-label': ariaLabel,
  names,
}) => {
  const [hasHeading, setHasHeadingState] = useState(false);
  // Read by the dev-only name check, which runs outside of render.
  const hasHeadingRef = useRef(false);
  const [hasBody, setHasBody] = useState(false);

  const setHasHeading = useCallback((nextHasHeading: boolean) => {
    hasHeadingRef.current = nextHasHeading;
    setHasHeadingState(nextHasHeading);
  }, []);

  const instanceId = useId();
  const headingId = `modal-heading-${instanceId}`;
  const bodyId = `modal-body-${instanceId}`;

  // No middleware: the panel is pinned to the viewport, not positioned against an element.
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

    // Portal children (including the heading) commit after this effect, so check a tick later.
    const timeoutId = setTimeout(() => {
      if (hasHeadingRef.current) return;

      console.warn(
        createDesignSystemError(
          names.component,
          `Add a <${names.component}.${names.heading}> or an \`aria-label\` so the ${names.component.toLowerCase()} has an accessible name.`
        )
      );
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [ariaLabel, isMounted, names.component, names.heading]);

  const contextValue = useMemo(
    () => ({ headingId, setHasHeading, bodyId, setHasBody }),
    [headingId, setHasHeading, bodyId]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {isMounted && (
        <FloatingPortal root={portalRoot ?? undefined}>
          <FloatingOverlay
            lockScroll
            data-status={status}
            data-testid={`${dataTestId}-overlay`}
            style={OVERLAY_STYLE}
            className={classNames(styles.overlay, styles[`position-${position}`])}
          >
            <FloatingFocusManager
              context={context}
              modal
              // Focus the panel by default so screen readers announce its name first.
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
    </ModalContext.Provider>
  );
};

ModalRoot.displayName = 'ModalRoot';

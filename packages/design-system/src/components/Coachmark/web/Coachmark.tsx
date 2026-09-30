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
  type OpenChangeReason,
  type Placement,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import { CloseIcon } from '@/icons';
import { Button } from '@/components/Button/web/Button';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/web/UtilityLabel';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/web/UtilityBody';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { CoachmarkPosition, CoachmarkProps } from '../Coachmark.types';
import { alignmentShift } from './alignmentShiftMiddleware';
import styles from './Coachmark.module.scss';

const ARROW_WIDTH = 12;
const ARROW_HEIGHT = 6;

/** Why the coachmark closed, reported on its `coachmark_dismiss` tracking event. */
type DismissReason = 'close_button' | 'trigger_press' | 'outside_press' | 'escape_key' | 'other';

// 'left'/'right' map to the opposite floating-ui '-start'/'-end' suffix, since the card is wider
// than its trigger: pinning the *matching* edge would stretch the card away from the named side.
const PLACEMENT: Record<CoachmarkPosition, Placement> = {
  'top-left': 'top-end',
  'top-center': 'top',
  'top-right': 'top-start',
  'bottom-left': 'bottom-end',
  'bottom-center': 'bottom',
  'bottom-right': 'bottom-start',
  'center-left': 'left',
  'center-right': 'right',
};

/**
 * A dismissible, pointed callout that surfaces an unprompted, single action -- e.g. a CMS-driven
 * prompt to create an account or favorite something. It's a standalone component with its own
 * floating-ui positioning, not a variant or wrapper of `Tooltip` -- it owns its entire visual
 * design (typography, icon badge, spacing, action button, close button) so it renders identically
 * wherever it's used, with no styling supplied by the consuming app.
 */
export const Coachmark: React.FC<CoachmarkProps> = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  icon,
  badgeText,
  ctaText,
  actionHref,
  onAction,
  secondaryContent,
  position = 'bottom-center',
  alignment = 'center',
  dismissOnOutsideClick = false,
  portalRoot: portalRootProp,
  zIndex = 9999,
  analytics: analyticsOverride,
}) => {
  const arrowRef = useRef<SVGSVGElement>(null);
  const coachmarkId = useId();
  const titleId = `coachmark-title-${coachmarkId}`;
  const descriptionId = `coachmark-description-${coachmarkId}`;
  const { track } = useAnalytics();

  const resolvedPortalRoot =
    portalRootProp ?? (typeof document !== 'undefined' ? document.body : null);

  // 'center-left'/'center-right' open beside the trigger, so vertical is their *alignment* axis
  // rather than the side axis -- shift below needs to know which.
  const isSidePosition = position === 'center-left' || position === 'center-right';

  const middleware = useMemo(
    () => [
      offset(ARROW_HEIGHT),
      // Order matters: flip must see the real overflow before shift absorbs it, and
      // alignmentShift must run before the general shift below for the same reason.
      // `crossAxis: false` restricts flip to side flips (top<->bottom) -- its default also flips
      // alignment immediately on overflow, preempting alignmentShift's 40%-budget behavior.
      flip({ boundary: resolvedPortalRoot ?? undefined, padding: 20, crossAxis: false }),
      // Shifts 'top/bottom-left/right' back into view along the alignment axis, up to 40% of the
      // card's width, before flipping alignment. No-op for centered/side positions.
      alignmentShift({ boundary: resolvedPortalRoot ?? undefined, padding: 20 }),
      // Vertical is always disabled here -- a coachmark must keep tracking its trigger even off
      // -screen, not get pinned near the viewport edge. Horizontal is a fallback safety net for
      // whatever alignmentShift didn't fully resolve.
      shift({
        boundary: resolvedPortalRoot ?? undefined,
        padding: 20,
        mainAxis: !isSidePosition,
        crossAxis: isSidePosition,
      }),
      // eslint-disable-next-line react-hooks/refs
      arrow({ element: arrowRef }),
    ],
    [resolvedPortalRoot, isSidePosition]
  );

  // Captured by `handleOpenChange`/`close` below and read by the shown/dismiss tracking effect
  // when `open` next flips to false, so `coachmark_dismiss` can report *why* it closed.
  const dismissReasonRef = useRef<DismissReason>('other');

  const handleOpenChange = useCallback(
    (nextOpen: boolean, _event?: Event, reason?: OpenChangeReason) => {
      if (!nextOpen) {
        dismissReasonRef.current =
          reason === 'reference-press'
            ? 'trigger_press'
            : reason === 'outside-press'
              ? 'outside_press'
              : reason === 'escape-key'
                ? 'escape_key'
                : 'other';
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  const { refs, context, floatingStyles } = useFloating({
    // 'fixed' (not 'absolute') avoids a jerky trail behind a sticky/fixed trigger: 'absolute'
    // positions in document coordinates, which keep changing under a stuck trigger and so need
    // a JS recompute every scroll frame that visibly lags the browser's native sticky behavior.
    strategy: 'fixed',
    placement: PLACEMENT[position],
    open,
    onOpenChange: handleOpenChange,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  // A coachmark only ever opens externally (e.g. Piano) -- unlike Tooltip, no hover/focus here.
  // Outside click/Escape are opt-in via `dismissOnOutsideClick`; the trigger itself always
  // dismisses regardless, since interacting with it again is an unambiguous close signal.
  const dismiss = useDismiss(context, {
    outsidePress: dismissOnOutsideClick,
    escapeKey: dismissOnOutsideClick,
    referencePress: true,
  });
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role]);

  // `useRole` assumes the standard disclosure pattern and auto-adds aria-expanded/aria-haspopup
  // /aria-controls to the reference -- invalid here since `children` is just a positioning anchor
  // (Piano opens the coachmark, not the trigger). Stripped from getReferenceProps' *output*
  // (not its input, and not called with no args) to keep its handler composition (e.g. a
  // passed-in onClick alongside the `referencePress` dismiss handler) intact.
  const stripReferenceRoleAria = <T extends Record<string, unknown>>(props: T) => {
    const {
      'aria-expanded': _ariaExpanded,
      'aria-haspopup': _ariaHaspopup,
      'aria-controls': _ariaControls,
      ...rest
    } = props;
    return rest;
  };

  const childElement = isValidElement(children)
    ? (children as ReactElement<Record<string, unknown>> & { ref?: React.Ref<unknown> })
    : null;

  const mergedRef = useMergeRefs([refs.setReference, childElement?.ref ?? null]);

  const triggerElement = childElement ? (
    cloneElement(
      childElement,
      stripReferenceRoleAria(getReferenceProps({ ...childElement.props, ref: mergedRef }))
    )
  ) : (
    <span ref={refs.setReference} {...stripReferenceRoleAria(getReferenceProps())}>
      {children}
    </span>
  );

  const close = useCallback(() => {
    dismissReasonRef.current = 'close_button';
    onOpenChange(false);
  }, [onOpenChange]);

  // Fires `coachmark_shown` on open and `coachmark_dismiss` on close, via cleanup rather than a
  // second branch watching `open` go back to false -- a consumer (e.g. `PianoCoachmark`) may
  // unmount this entire component to close it, rather than keeping it mounted with `open={false}`,
  // and only a cleanup function is guaranteed to still run in that case.
  useEffect(() => {
    if (!open) return;

    track({
      event: 'coachmark_shown',
      component: 'Coachmark',
      title,
      position,
      alignment,
      ...analyticsOverride,
    });

    return () => {
      track({
        event: 'coachmark_dismiss',
        component: 'Coachmark',
        title,
        position,
        alignment,
        dismiss_reason: dismissReasonRef.current,
        ...analyticsOverride,
      });
      dismissReasonRef.current = 'other';
    };
  }, [open, title, position, alignment, analyticsOverride, track]);

  const handleActionClick = useCallback(() => {
    track({
      event: 'coachmark_cta_click',
      component: 'Coachmark',
      title,
      cta_text: ctaText,
      position,
      alignment,
      ...analyticsOverride,
    });
    onAction?.();
  }, [track, title, ctaText, position, alignment, analyticsOverride, onAction]);

  return (
    <>
      {triggerElement}
      {open && (
        // preserveTabOrder's hidden guard elements are unlabeled and fail axe's
        // aria-command-name rule; unnecessary for a non-modal panel.
        <FloatingPortal root={resolvedPortalRoot} preserveTabOrder={false}>
          {/* modal={false}: a coachmark never blocks the rest of the page. initialFocus moves
              focus to the panel itself so a screen reader announces title/description before an
              unprompted coachmark would otherwise go undiscovered. guards={false}: same
              aria-command-name issue as preserveTabOrder above, and focus isn't meant to be
              trapped in a non-modal panel anyway. */}
          <FloatingFocusManager
            context={context}
            modal={false}
            guards={false}
            // eslint-disable-next-line react-hooks/refs
            initialFocus={refs.floating}
          >
            <div
              // eslint-disable-next-line react-hooks/refs
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex }}
              className={styles.wrapper}
              id={`coachmark-${coachmarkId}`}
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              {...getFloatingProps()}
            >
              {badgeText && (
                <span className={styles.badge}>
                  <UtilityLabel size="small" weight="semibold" capitalize color="on-dark-primary">
                    {badgeText}
                  </UtilityLabel>
                </span>
              )}
              <FloatingArrow
                ref={arrowRef}
                context={context}
                height={ARROW_HEIGHT}
                width={ARROW_WIDTH}
                fill="var(--color-background-light-default)"
                // Matches .wrapper's `border: 1px solid`. FloatingArrow only strokes the two
                // exposed slanted edges (never the base, which sits tucked under the panel), so
                // this reads as the card's own outline continuing around the arrow instead of a
                // doubled-up border where the arrow meets the panel.
                stroke="var(--color-border-on-light-subtle-01)"
                strokeWidth={1}
                className={styles.arrow}
              />
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className={styles.closeButton}
              >
                <CloseIcon size="medium" />
              </button>
              <div
                className={classNames(
                  styles.body,
                  alignment === 'center' ? styles.bodyCentered : undefined,
                  !ctaText && styles.bodyWithoutActions
                )}
              >
                {icon && (
                  <div className={styles.iconBadge} aria-hidden>
                    {icon}
                  </div>
                )}
                <div id={titleId}>
                  <UtilityLabel size="large" weight="semibold" className={styles.title}>
                    {title}
                  </UtilityLabel>
                </div>
                <div id={descriptionId}>
                  <UtilityBody size="small" className={styles.description}>
                    {description}
                  </UtilityBody>
                </div>
                {ctaText && (
                  <div className={styles.actions}>
                    <Button
                      as={actionHref ? 'a' : undefined}
                      href={actionHref}
                      type={actionHref ? undefined : 'button'}
                      onClick={handleActionClick}
                      variant="filled"
                      color="neutral"
                      size="small"
                      capitalize={false}
                      className={styles.actionButton}
                    >
                      {ctaText}
                    </Button>
                    {secondaryContent}
                  </div>
                )}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};

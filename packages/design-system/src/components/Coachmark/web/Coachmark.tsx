'use client';

import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';
import classNames from 'classnames';
import {
  arrow,
  flip,
  offset,
  type OpenChangeReason,
  shift,
  useDismiss,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import { FloatingPopupSurface, PopupArrow } from '@/components/FloatingPopup/FloatingPopup';
import type { PopupArrowSpec } from '@/components/FloatingPopup/FloatingPopup.types';
import { useFloatingPopup } from '@/components/FloatingPopup/useFloatingPopup';
import { CloseIcon } from '@/icons';
import { Button } from '@/components/Button/web/Button';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/web/UtilityLabel';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/web/UtilityBody';
import { useAnalytics } from '@/hooks/useAnalytics';
import { resolveResponsive, useBreakpoint } from '@/hooks/useResponsiveValue';
import type { CoachmarkProps } from '../Coachmark.types';
import { alignmentShift } from './alignmentShiftMiddleware';
import styles from './Coachmark.module.scss';

// Size from the Core Components Coachmark design. `cornerInset` keeps the arrow out of the card's
// rounded corners.
const ARROW_SPEC: PopupArrowSpec = { width: 16, height: 12, cornerInset: 16 };

// Matches the card's max-width margin in Coachmark.module.scss. flip() needs this much room before
// it switches sides.
const VIEWPORT_EDGE_PADDING = 24;

// Smaller than VIEWPORT_EDGE_PADDING so corner triggers hug the edge. alignmentShift and shift must
// share it, or shift overrides alignmentShift.
const EDGE_HUGGING_PADDING = 8;

/** Why the coachmark closed, reported on its `coachmark_dismiss` tracking event. */
type DismissReason = 'close_button' | 'trigger_press' | 'outside_press' | 'escape_key' | 'other';

// Reasons this component's dismiss setup sends. Anything else reports 'other'.
const DISMISS_REASONS: Partial<Record<OpenChangeReason, DismissReason>> = {
  'reference-press': 'trigger_press',
  'outside-press': 'outside_press',
  'escape-key': 'escape_key',
};

// `useRole` adds these to the reference, but `children` is only an anchor: Piano opens the
// coachmark, not the trigger. Strip them from `getReferenceProps`' output to keep its merged
// handlers, and keep any the child set itself.
const REFERENCE_ROLE_ARIA = ['aria-expanded', 'aria-haspopup', 'aria-controls'] as const;

const stripAddedReferenceRoleAria = <T extends Record<string, unknown>>(
  props: T,
  originalProps: Record<string, unknown>
): T => {
  const result: Record<string, unknown> = { ...props };
  REFERENCE_ROLE_ARIA.forEach((key) => {
    if (key in originalProps) {
      result[key] = originalProps[key];
    } else {
      delete result[key];
    }
  });
  return result as T;
};

/**
 * A dismissible callout anchored to `children` that surfaces one unprompted action, such as a
 * CMS-driven sign-up prompt. It owns its visual design, so it renders the same in any app.
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
  secondaryCtaText,
  secondaryContent,
  secondaryActionHref,
  onSecondaryAction,
  ctaLayout = 'stacked',
  counter,
  showCloseButton = true,
  placement: placementProp,
  alignment = 'center',
  dismissOnOutsideClick = false,
  portalRoot: portalRootProp,
  zIndex = 9999,
  analytics: analyticsOverride,
  trackReferenceMovement = false,
  impressionTrackingId,
}) => {
  const coachmarkId = useId();
  const titleId = `coachmark-title-${coachmarkId}`;
  const descriptionId = `coachmark-description-${coachmarkId}`;
  const { track } = useAnalytics();

  const resolvedPortalRoot =
    portalRootProp ?? (typeof document !== 'undefined' ? document.body : null);

  const breakpoint = useBreakpoint();
  const placement = resolveResponsive(placementProp, breakpoint) ?? 'bottom';

  // Side placements align vertically, so `shift` swaps axes for them.
  const isSidePlacement = placement === 'left' || placement === 'right';

  const middleware = (arrowElement: SVGSVGElement | null) => [
    offset(ARROW_SPEC.height),
    // flip and alignmentShift must see the overflow before shift absorbs it. `crossAxis: false`
    // limits flip to sides so alignmentShift handles alignment.
    flip({
      boundary: resolvedPortalRoot ?? undefined,
      padding: VIEWPORT_EDGE_PADDING,
      crossAxis: false,
    }),
    // Shifts '-start'/'-end' placements up to 40% of the card width before flipping alignment.
    alignmentShift({
      boundary: resolvedPortalRoot ?? undefined,
      padding: EDGE_HUGGING_PADDING,
    }),
    // Never shifts vertically, so the card follows its trigger off-screen.
    shift({
      boundary: resolvedPortalRoot ?? undefined,
      padding: EDGE_HUGGING_PADDING,
      mainAxis: !isSidePlacement,
      crossAxis: isSidePlacement,
    }),
    arrow({ element: arrowElement, padding: ARROW_SPEC.cornerInset }),
  ];

  // Set by `recordDismissReason` or `close`, and read when the dismiss event fires.
  const dismissReasonRef = useRef<DismissReason>('other');

  // Keeps the tracking effect's deps to [open, track]. A new `analytics` object on each render
  // would otherwise re-run it and fire a false dismiss and shown. Refs can't be written during
  // render, so an effect updates it.
  const trackingPropsRef = useRef({
    title,
    placement,
    alignment,
    analyticsOverride,
  });
  useEffect(() => {
    trackingPropsRef.current = { title, placement, alignment, analyticsOverride };
  });

  const recordDismissReason = useCallback((reason: OpenChangeReason | undefined) => {
    dismissReasonRef.current = (reason && DISMISS_REASONS[reason]) ?? 'other';
  }, []);

  const {
    refs: { setReference, setFloating, floating },
    context,
    floatingStyles,
    setArrowElement,
  } = useFloatingPopup({
    // 'absolute' lags behind sticky or fixed triggers, since it recomputes every scroll frame.
    strategy: 'fixed',
    placement,
    open,
    onOpenChange,
    onClose: recordDismissReason,
    // Per-frame updates keep up with a trigger that scrolls with the page, at the cost of a rAF
    // loop while open.
    autoUpdateOptions: { animationFrame: trackReferenceMovement },
    middleware,
  });

  // Opens only externally, such as from Piano. Outside press and Escape are opt-in. Pressing the
  // trigger always closes it.
  const dismiss = useDismiss(context, {
    outsidePress: dismissOnOutsideClick,
    escapeKey: dismissOnOutsideClick,
    referencePress: true,
  });
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role]);

  const childElement = isValidElement(children)
    ? (children as ReactElement<Record<string, unknown>> & { ref?: React.Ref<unknown> })
    : null;

  const mergedRef = useMergeRefs([setReference, childElement?.ref ?? null]);

  const triggerElement = childElement ? (
    cloneElement(
      childElement,
      stripAddedReferenceRoleAria(
        getReferenceProps({ ...childElement.props, ref: mergedRef }),
        childElement.props
      )
    )
  ) : (
    <span ref={setReference} {...stripAddedReferenceRoleAria(getReferenceProps(), {})}>
      {children}
    </span>
  );

  const close = useCallback(() => {
    dismissReasonRef.current = 'close_button';
    onOpenChange(false);
  }, [onOpenChange]);

  // Dismiss fires from cleanup so it also runs when a consumer, such as `PianoCoachmark`, unmounts
  // the coachmark instead of setting `open={false}`.
  useEffect(() => {
    if (!open) return;

    const { title, placement, alignment, analyticsOverride } = trackingPropsRef.current;
    track({
      event: 'coachmark_shown',
      component: 'Coachmark',
      title,
      placement,
      alignment,
      ...analyticsOverride,
    });

    return () => {
      const { title, placement, alignment, analyticsOverride } = trackingPropsRef.current;
      track({
        event: 'coachmark_dismiss',
        component: 'Coachmark',
        title,
        placement,
        alignment,
        dismiss_reason: dismissReasonRef.current,
        ...analyticsOverride,
      });
      dismissReasonRef.current = 'other';
    };
  }, [open, track]);

  const trackCtaClick = (ctaRole: 'primary' | 'secondary', ctaLabel: string | undefined) =>
    track({
      event: 'coachmark_cta_click',
      component: 'Coachmark',
      title,
      cta_text: ctaLabel,
      cta_role: ctaRole,
      placement,
      alignment,
      ...analyticsOverride,
    });

  // A link CTA navigates on its own, so its callback is ignored.
  const handleActionClick = () => {
    trackCtaClick('primary', ctaText);
    if (!actionHref) onAction?.();
  };

  const handleSecondaryActionClick = () => {
    trackCtaClick('secondary', secondaryCtaText);
    if (!secondaryActionHref) onSecondaryAction?.();
  };

  const hasActions = Boolean(ctaText || secondaryCtaText);
  const primaryAction = ctaText && (
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
  );
  const secondaryAction = secondaryCtaText && (
    <Button
      as={secondaryActionHref ? 'a' : undefined}
      href={secondaryActionHref}
      type={secondaryActionHref ? undefined : 'button'}
      onClick={handleSecondaryActionClick}
      variant="ghost"
      color="neutral"
      size="small"
      capitalize={false}
      className={styles.actionButton}
    >
      {secondaryCtaText}
    </Button>
  );

  return (
    <>
      {triggerElement}
      {/* preserveTabOrder and guards add unlabeled elements that fail axe's aria-command-name
          rule, and a non-modal panel needs neither. Focusing the panel makes screen readers
          announce it. */}
      <FloatingPopupSurface
        context={context}
        setFloating={setFloating}
        floatingStyles={floatingStyles}
        portalProps={{ root: resolvedPortalRoot, preserveTabOrder: false }}
        focusProps={{ guards: false, initialFocus: floating }}
        style={{ zIndex }}
        className={styles.wrapper}
        id={`coachmark-${coachmarkId}`}
        // flip() may pick the other side. Expose the actual one to CSS.
        data-placement={context.placement}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        {...getFloatingProps()}
      >
        {impressionTrackingId && (
          <div
            id={impressionTrackingId}
            aria-hidden="true"
            // Keeps injected third-party content, such as an iframe, out of the tab order.
            inert
            // Clips injected content to the card's rounded corners. .wrapper stays visible for the
            // arrow and shadow.
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              borderRadius: 'inherit',
              pointerEvents: 'none',
              // Below the card's in-flow content, above its background. .wrapper's z-index makes it
              // the stacking context.
              zIndex: -1,
            }}
          />
        )}
        {badgeText && (
          <span className={styles.badge}>
            <UtilityLabel size="small" weight="semibold" capitalize color="on-dark-primary">
              {badgeText}
            </UtilityLabel>
          </span>
        )}
        <PopupArrow
          ref={setArrowElement}
          context={context}
          arrowSpec={ARROW_SPEC}
          className={styles.arrow}
        />
        {counter ? (
          <UtilityBody size="x-small" color="on-light-tertiary" className={styles.counter}>
            {counter}
          </UtilityBody>
        ) : (
          showCloseButton && (
            <button type="button" aria-label="Close" onClick={close} className={styles.closeButton}>
              <CloseIcon size="medium" />
            </button>
          )
        )}
        <div
          className={classNames(
            styles.body,
            alignment === 'center' ? styles.bodyCentered : undefined,
            !hasActions && styles.bodyWithoutActions
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
          {hasActions && (
            <div className={styles.actions}>
              {/* Inline puts the secondary action first, so the primary action ends the row. */}
              <div className={classNames(styles.ctas, styles[ctaLayout])}>
                {ctaLayout === 'inline' ? secondaryAction : primaryAction}
                {ctaLayout === 'inline' ? primaryAction : secondaryAction}
              </div>
              {secondaryContent}
            </div>
          )}
        </div>
      </FloatingPopupSurface>
    </>
  );
};

'use client';

import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
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
import type { CoachmarkPosition, CoachmarkProps } from '../Coachmark.types';
import styles from './Coachmark.module.scss';

const ARROW_WIDTH = 12;
const ARROW_HEIGHT = 6;

// Maps each combined position directly to a floating-ui placement. The 'left'/'right' suffixes
// for top/bottom are inverted from floating-ui's own '-start'/'-end' cross-axis alignment: since
// the coachmark is almost always wider than its trigger, aligning by the trigger's *matching*
// edge ('-start' for 'left') pins that edge in place and lets the (wider) card extend away from
// it -- e.g. 'top-left' with '-start' would pin the card's left edge to the trigger's left edge,
// so the card would actually stretch out to the trigger's right. Using the opposite suffix makes
// the card visually sit on the named side instead.
const PLACEMENT: Record<CoachmarkPosition, Placement> = {
  'top-left': 'top-end',
  'top-center': 'top',
  'top-right': 'top-start',
  'bottom-left': 'bottom-end',
  'bottom-center': 'bottom',
  'bottom-right': 'bottom-start',
  'left-center': 'left',
  'right-center': 'right',
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
  dismissOnOutsideClick = false,
  portalRoot: portalRootProp,
  zIndex = 9999,
}) => {
  const arrowRef = useRef<SVGSVGElement>(null);
  const coachmarkId = useId();
  const titleId = `coachmark-title-${coachmarkId}`;
  const descriptionId = `coachmark-description-${coachmarkId}`;

  const resolvedPortalRoot =
    portalRootProp ?? (typeof document !== 'undefined' ? document.body : null);

  // 'left-center'/'right-center' open beside the trigger (floating-ui's bare 'left'/'right'
  // placements) rather than above/below it -- vertical is the *alignment* axis there instead of
  // the side axis, which is what the shift middleware below needs to know.
  const isSidePosition = position === 'left-center' || position === 'right-center';

  const middleware = useMemo(
    () => [
      offset(ARROW_HEIGHT),
      // `padding` here is a safety margin, not visual spacing -- it makes flip/shift react once
      // the coachmark comes within this many px of the viewport edge, rather than waiting until
      // it's fully flush (e.g. flip switching sides as soon as a left-aligned coachmark gets this
      // close to the left edge, such as on a narrower viewport).
      //
      // flip must run *before* shift: shift nudges the coachmark back into view along its current
      // side, which (if it ran first) would quietly absorb the overflow that flip needs to see to
      // decide to switch sides at all -- the coachmark would just get pushed toward center instead
      // of ever flipping.
      flip({ boundary: resolvedPortalRoot ?? undefined, padding: 20 }),
      // Shift must never adjust the *vertical* position: a coachmark has to keep tracking its
      // trigger even after it scrolls off-screen (e.g. above the viewport), not stay pinned near
      // the viewport edge once the trigger is no longer nearby. Which of shift's axis options
      // ("mainAxis"/"crossAxis") maps to vertical depends on the placement's own side -- for
      // top/bottom positions, vertical is the side's own axis ("crossAxis" in floating-ui's
      // terms); for left/right positions, vertical is the alignment axis ("mainAxis"). So vertical
      // is always disabled, and the other (horizontal) axis is enabled to give the narrow-viewport
      // buffer fix from before: a left/right coachmark that still doesn't fully fit even on flip's
      // best-fit side needs that horizontal correction, since flip alone can't shrink it further.
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

  const { refs, context, floatingStyles } = useFloating({
    // `strategy: 'fixed'` (not the default 'absolute') matters specifically for triggers inside a
    // sticky/fixed-positioned ancestor (e.g. a sticky site header): 'absolute' positions in
    // document coordinates, which stay correct for a normally-scrolling trigger without any JS
    // (the browser scrolls both together), but for a sticky trigger its on-screen position never
    // moves while its document coordinates keep changing, so autoUpdate's scroll listener has to
    // recompute new coordinates every scroll frame -- and that JS-driven recalculation visibly
    // lags behind the browser's native, JS-free sticky positioning, producing a jerky trail.
    // 'fixed' uses viewport coordinates instead: for a sticky/fixed trigger those coordinates
    // don't need to change at all once stuck (autoUpdate's recompute is a no-op), and for a
    // normally-scrolling trigger they're recomputed on scroll exactly as before -- so this fixes
    // the sticky case with no special-casing per app, and no change in behavior for the other.
    strategy: 'fixed',
    placement: PLACEMENT[position],
    open,
    onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  // A coachmark is only ever opened externally (e.g. a CMS-driven prompt), never by interacting
  // with its own trigger -- so unlike Tooltip, there's no hover/focus handling here. Outside click
  // is opt-in via `dismissOnOutsideClick` (a Piano campaign may want the coachmark to persist until
  // an explicit action), but Escape and pressing the trigger itself always dismiss regardless of
  // that setting -- Escape is the standard keyboard convention for closing transient UI, and the
  // trigger is still visible and actionable, so interacting with it again is an unambiguous signal
  // to close.
  const dismiss = useDismiss(context, {
    outsidePress: dismissOnOutsideClick,
    escapeKey: true,
    referencePress: true,
  });
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role]);

  const childElement = isValidElement(children)
    ? (children as ReactElement<Record<string, unknown>> & { ref?: React.Ref<unknown> })
    : null;

  const mergedRef = useMergeRefs([refs.setReference, childElement?.ref ?? null]);

  const triggerElement = childElement ? (
    cloneElement(childElement, getReferenceProps({ ...childElement.props, ref: mergedRef }))
  ) : (
    // eslint-disable-next-line react-hooks/refs
    <span ref={refs.setReference} {...getReferenceProps()}>
      {children}
    </span>
  );

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  return (
    <>
      {triggerElement}
      {open && (
        <FloatingPortal root={resolvedPortalRoot}>
          {/* `modal={false}`: a coachmark never blocks the rest of the page -- the underlying
              content stays fully interactive while it's open. `initialFocus={refs.floating}`
              moves focus to the panel itself (not its first control) so a screen reader
              announces the title/description (via aria-labelledby/describedby below) before the
              user tabs into the close/action buttons -- without this, a coachmark that appears
              unprompted (e.g. a CMS-driven prompt firing while the user is reading elsewhere on
              the page) would be entirely undiscoverable to keyboard/screen-reader users. */}
          <FloatingFocusManager
            context={context}
            modal={false}
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
                strokeWidth={0}
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
              <div className={classNames(styles.body, icon ? styles.bodyCentered : undefined)}>
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
                  <UtilityBody size="x-small" className={styles.description}>
                    {description}
                  </UtilityBody>
                </div>
                {ctaText && (
                  <div className={styles.actions}>
                    <Button
                      as={actionHref ? 'a' : undefined}
                      href={actionHref}
                      type={actionHref ? undefined : 'button'}
                      onClick={onAction}
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

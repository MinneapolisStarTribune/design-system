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
  FloatingPortal,
  flip,
  offset,
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
import type { CoachmarkAlign, CoachmarkPosition, CoachmarkProps } from '../Coachmark.types';
import styles from './Coachmark.module.scss';

const ARROW_WIDTH = 12;
const ARROW_HEIGHT = 6;

const ALIGN_SUFFIX: Record<CoachmarkAlign, '' | '-start' | '-end'> = {
  center: '',
  left: '-start',
  right: '-end',
};

function toPlacement(position: CoachmarkPosition, align: CoachmarkAlign) {
  // `position: 'center'` opts out of top/bottom entirely -- `align` becomes the side instead,
  // vertically centered on the trigger (floating-ui's bare 'left'/'right' placements already
  // center on the cross axis by default). 'center' + 'center' has no side to anchor to, so it
  // falls back to the overall default placement.
  if (position === 'center') {
    if (align === 'left') return 'left';
    if (align === 'right') return 'right';
    return 'bottom';
  }

  return `${position}${ALIGN_SUFFIX[align]}` as const;
}

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
  ctaText,
  actionHref,
  onAction,
  secondaryContent,
  position = 'bottom',
  align = 'center',
  dismissOnOutsideClick = false,
  portalRoot: portalRootProp,
  zIndex = 9999,
}) => {
  const arrowRef = useRef<SVGSVGElement>(null);
  const coachmarkId = useId();

  const resolvedPortalRoot =
    portalRootProp ?? (typeof document !== 'undefined' ? document.body : null);

  const middleware = useMemo(
    () => [
      offset(ARROW_HEIGHT),
      shift({ boundary: resolvedPortalRoot ?? undefined, padding: 0 }),
      flip({ boundary: resolvedPortalRoot ?? undefined, padding: 0 }),
      // eslint-disable-next-line react-hooks/refs
      arrow({ element: arrowRef }),
    ],
    [resolvedPortalRoot]
  );

  const { refs, context, floatingStyles } = useFloating({
    placement: toPlacement(position, align),
    open,
    onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  // A coachmark is only ever opened externally (e.g. a CMS-driven prompt), never by interacting
  // with its own trigger -- so unlike Tooltip, there's no hover/focus/click handling here, just
  // an optional outside-click/Escape dismissal and the dialog role for the floating content.
  const dismiss = useDismiss(context, { enabled: dismissOnOutsideClick });
  const role = useRole(context, { role: 'dialog' });

  const { getFloatingProps } = useInteractions([dismiss, role]);

  const childElement = isValidElement(children)
    ? (children as ReactElement<Record<string, unknown>> & { ref?: React.Ref<unknown> })
    : null;

  const mergedRef = useMergeRefs([refs.setReference, childElement?.ref ?? null]);

  const triggerElement = childElement ? (
    cloneElement(childElement, { ...childElement.props, ref: mergedRef })
  ) : (
    // eslint-disable-next-line react-hooks/refs
    <span ref={refs.setReference}>{children}</span>
  );

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  return (
    <>
      {triggerElement}
      {open && (
        <FloatingPortal root={resolvedPortalRoot}>
          <div
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex }}
            className={styles.wrapper}
            id={`coachmark-${coachmarkId}`}
            {...getFloatingProps()}
          >
            <FloatingArrow
              ref={arrowRef}
              context={context}
              height={ARROW_HEIGHT}
              width={ARROW_WIDTH}
              fill="var(--color-background-light-default)"
              strokeWidth={0}
              className={styles.arrow}
            />
            <button type="button" aria-label="Close" onClick={close} className={styles.closeButton}>
              <CloseIcon size="medium" />
            </button>
            <div className={classNames(styles.body, icon ? styles.bodyCentered : undefined)}>
              {icon && (
                <div className={styles.iconBadge} aria-hidden>
                  {icon}
                </div>
              )}
              <UtilityLabel size="large" weight="semibold" className={styles.title}>
                {title}
              </UtilityLabel>
              <UtilityBody size="x-small" className={styles.description}>
                {description}
              </UtilityBody>
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
        </FloatingPortal>
      )}
    </>
  );
};

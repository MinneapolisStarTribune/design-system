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
import styles from './Popover.module.scss';
import { PopoverBody } from './PopoverBody';
import {
  PopoverContext,
  PopoverPortalRootContext,
  PopoverPortalRootProvider,
} from './PopoverContext';
import { PopoverDescription } from './PopoverDescription';
import { PopoverDivider } from './PopoverDivider';
import { PopoverExternalContent } from './PopoverExternalContent';
import { PopoverHeading } from './PopoverHeading';
import { PopoverProps } from './Popover.types';

const ARROW_HEIGHT = 8;
const GAP = 4;

// Extracted as a constant so it's not recreated on every render.
const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

const PopoverRoot: React.FC<PopoverProps> = ({
  trigger,
  children,
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
  ...rest
}) => {
  const [openState, setOpenState] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);
  const headingId = useId();

  const portalRootFromContext = useContext(PopoverPortalRootContext);
  const resolvedPortalRoot = portalRootProp ?? portalRootFromContext ?? undefined;

  // Support controlled and uncontrolled modes
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
    onOpenChange: handleOpenChange,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  const click = useClick(context, { enabled: !isDisabled && Boolean(trigger) });
  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true });
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  // Routes through `handleOpenChange` (rather than duplicating its logic) so every close — the
  // heading's close button, a composed `Popover.ExternalContent`'s dismiss control, an outside
  // click, or Escape — goes through the same path a consumer's `onOpenChange` observes.
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

  // Anchor-only mode: `trigger` was omitted entirely, so there's no visible/clickable trigger
  // element at all — this popover can only ever be opened via a controlled `open` prop the
  // consumer drives themselves. Render a plain, fully non-interactive anchor (no role, no
  // tabIndex, no getReferenceProps() spread) so it never becomes locally clickable — structural,
  // not a toggled state. (Local click-to-open is also already disabled entirely via
  // `Boolean(trigger)` on `useClick` above.)
  const isAnchorOnly = !childElement && trigger === undefined;

  // Put ARIA attributes (aria-expanded, aria-haspopup) on the trigger when it's a single
  // element that allows them (e.g. button). Otherwise use a wrapper with role="button" — unless
  // there's no trigger at all, in which case that wrapper must stay inert (anchor-only mode).
  let triggerElement: React.ReactNode;
  if (childElement) {
    triggerElement = cloneElement(
      childElement,
      getReferenceProps({
        ...childElement.props,
        ref: mergedRef,
        // Merge consumer styles only when present to avoid creating an extra object
        // on every render when no custom style is provided
        style: childElement.props.style
          ? { ...childElement.props.style, ...triggerStyle }
          : triggerStyle,
      })
    );
  } else if (isAnchorOnly) {
    triggerElement = (
      <span ref={refs.setReference} style={{ display: 'inline-block' }} aria-hidden />
    );
  } else {
    triggerElement = (
      <span
        // Same `refs.setReference` callback as the anchor-only branch above; only one of these
        // two mutually-exclusive branches ever renders per instance, but the linter can't see that.
        // eslint-disable-next-line react-hooks/refs
        ref={refs.setReference}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        style={triggerStyle}
        {...getReferenceProps()}
      >
        {trigger}
      </span>
    );
  }

  // Memoize context value to prevent unnecessary re-renders of all
  // context consumers when this component re-renders for unrelated reasons.
  const contextValue = useMemo(() => ({ close }), [close]);

  return (
    <PopoverPortalRootProvider>
      <PopoverContext.Provider value={contextValue}>
        {triggerElement}
        {open && (
          <FloatingPortal root={resolvedPortalRoot}>
            <FloatingFocusManager context={context} modal={modal}>
              <div
                // eslint-disable-next-line react-hooks/refs
                ref={refs.setFloating}
                style={floatingStyles}
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
                  <div className={classNames(styles.content, contentClassName)}>{children}</div>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </PopoverContext.Provider>
    </PopoverPortalRootProvider>
  );
};

/* Compound API */

type PopoverComponent = React.FC<PopoverProps> & {
  Heading: typeof PopoverHeading;
  Description: typeof PopoverDescription;
  Body: typeof PopoverBody;
  Divider: typeof PopoverDivider;
  ExternalContent: typeof PopoverExternalContent;
};

export const Popover = PopoverRoot as PopoverComponent;

Popover.Heading = PopoverHeading;
Popover.Body = PopoverBody;
Popover.Description = PopoverDescription;
Popover.Divider = PopoverDivider;
Popover.ExternalContent = PopoverExternalContent;

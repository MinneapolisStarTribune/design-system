'use client';

import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
  useContext,
  useId,
  useMemo,
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
import { PopoverHeading } from './PopoverHeading';
import { PopoverProps } from './Popover.types';

const DEFAULT_ARROW_SIZE = { width: 16, height: 8 };
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
  style: styleProp,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  portalRoot: portalRootProp,
  'aria-label': ariaLabel,
  anchorEl,
  role = 'dialog',
  hideArrow = false,
  arrowStaticOffset,
  arrowSize = DEFAULT_ARROW_SIZE,
  arrowPadding = 0,
  initialFocus,
  ...rest
}) => {
  const [openState, setOpenState] = useState(false);
  // State instead of a ref so `arrow()` receives the element, not a ref it could read during render.
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const headingId = useId();

  const portalRootFromContext = useContext(PopoverPortalRootContext);
  const resolvedPortalRoot = portalRootProp ?? portalRootFromContext ?? undefined;
  const isAnchored = anchorEl !== undefined;

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
      offset(hideArrow ? GAP : arrowSize.height + GAP),
      shift({ boundary: resolvedPortalRoot, padding: GAP }),
      flip({ boundary: resolvedPortalRoot, padding: GAP }),
      arrow({ element: arrowElement, padding: arrowPadding }),
    ],
    [resolvedPortalRoot, hideArrow, arrowSize.height, arrowPadding, arrowElement]
  );

  const {
    refs: { setReference, setFloating },
    context,
    floatingStyles,
  } = useFloating({
    placement,
    open,
    onOpenChange: handleOpenChange,
    whileElementsMounted: autoUpdate,
    middleware,
    elements: isAnchored ? { reference: anchorEl } : undefined,
  });

  const click = useClick(context, { enabled: !isDisabled && !isAnchored });
  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true });
  const roleInteraction = useRole(context, { role });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    roleInteraction,
  ]);

  const close = useCallback(() => {
    if (!isControlled) {
      setOpenState(false);
    }
    onOpenChangeProp?.(false);
  }, [isControlled, onOpenChangeProp]);

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

  const mergedRef = useMergeRefs([setReference, childElement?.ref ?? null]);

  const triggerStyle = isDisabled ? DISABLED_TRIGGER_STYLE : ENABLED_TRIGGER_STYLE;

  // Put ARIA attributes (aria-expanded, aria-haspopup) on the trigger when it's a single
  // element that allows them (e.g. button). Otherwise use a wrapper with role="button".
  const triggerElement =
    !isAnchored &&
    (childElement ? (
      cloneElement(
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
      )
    ) : (
      <span
        ref={setReference}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        style={triggerStyle}
        {...getReferenceProps()}
      >
        {trigger}
      </span>
    ));

  // Memoize context value to prevent unnecessary re-renders of all
  // context consumers when this component re-renders for unrelated reasons.
  const contextValue = useMemo(() => ({ close }), [close]);

  const content = (
    <PopoverContext.Provider value={contextValue}>
      {triggerElement}
      {open && (
        <FloatingPortal root={resolvedPortalRoot}>
          <FloatingFocusManager context={context} modal={modal} initialFocus={initialFocus}>
            <div
              ref={setFloating}
              style={{ ...floatingStyles, ...styleProp }}
              className={classNames(styles.wrapper, wrapperClassName)}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabel ? undefined : `popover-heading-${headingId}`}
              {...getFloatingProps()}
              {...rest}
            >
              {!hideArrow && (
                <FloatingArrow
                  ref={setArrowElement}
                  context={context}
                  height={arrowSize.height}
                  width={arrowSize.width}
                  fill={arrowFill}
                  stroke={arrowStroke}
                  strokeWidth={1}
                  staticOffset={arrowStaticOffset}
                  className={classNames(styles.arrow, arrowClassName)}
                />
              )}
              <div className={classNames(styles.container, containerClassName)}>
                <div className={classNames(styles.content, contentClassName)}>{children}</div>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </PopoverContext.Provider>
  );

  // Anchored popovers have no trigger to wrap, so skip the portal-root wrapper div to avoid
  // adding an element to the consumer's layout.
  if (isAnchored) return content;

  return <PopoverPortalRootProvider>{content}</PopoverPortalRootProvider>;
};

/* Compound API */

type PopoverComponent = React.FC<PopoverProps> & {
  Heading: typeof PopoverHeading;
  Description: typeof PopoverDescription;
  Body: typeof PopoverBody;
  Divider: typeof PopoverDivider;
};

export const Popover = PopoverRoot as PopoverComponent;

Popover.Heading = PopoverHeading;
Popover.Body = PopoverBody;
Popover.Description = PopoverDescription;
Popover.Divider = PopoverDivider;

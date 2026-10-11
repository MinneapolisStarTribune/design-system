'use client';

import { cloneElement, isValidElement, useCallback, useId, useMemo, useState } from 'react';
import classNames from 'classnames';
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
} from '@floating-ui/react';
import { PopoverContext } from './PopoverContext';
import { composeTriggerProps, getPopupMiddleware, PopupArrow, popupStyles } from './floatingPopup';
import type { PopupTriggerProps } from './floatingPopup';
import { POPOVER_ARROW } from './Popover.constants';
import { PopoverProps } from './Popover.types';

const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

export const PopoverRoot: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  isDisabled,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  id,
  'aria-label': ariaLabel,
  modal = false,
  className,
  style,
  portalRoot,
  dataTestId,
}) => {
  const [openState, setOpenState] = useState(false);
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const generatedId = useId();
  const surfaceId = id ?? generatedId;
  const headingId = useId();
  const [hasHeading, setHasHeading] = useState(false);
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

  const boundary = portalRoot ?? undefined;
  const {
    refs: { setReference, setFloating },
    context,
    floatingStyles,
  } = useFloating({
    placement,
    open,
    onOpenChange: handleOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: getPopupMiddleware({ boundary, arrowElement, arrowSpec: POPOVER_ARROW }),
  });
  const click = useClick(context, { enabled: !isDisabled });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  // Memoize context value to prevent unnecessary re-renders of all
  // context consumers when this component re-renders for unrelated reasons.
  const contextValue = useMemo(
    () => ({ close: () => handleOpenChange(false), headingId, setHasHeading }),
    [handleOpenChange, headingId]
  );
  // A heading names the dialog when present. Otherwise `aria-label` does.
  const labelProps = hasHeading ? { 'aria-labelledby': headingId } : { 'aria-label': ariaLabel };

  // Set explicitly: `useRole` would point `aria-controls` at a generated id before the surface mounts.
  const triggerAriaProps = {
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? surfaceId : undefined,
    'aria-disabled': isDisabled || undefined,
  } as const;

  const childElement = isValidElement<PopupTriggerProps>(trigger) ? trigger : null;
  const triggerRef = useMergeRefs([setReference, childElement?.props.ref ?? null]);

  // Add trigger props to a single element. Otherwise, use a button-role wrapper.
  const triggerElement = childElement ? (
    cloneElement(childElement, {
      ...composeTriggerProps(childElement.props, getReferenceProps(triggerAriaProps)),
      ref: triggerRef,
      // Element triggers keep their own display, and their own style wins over the cursor.
      style: { cursor: isDisabled ? 'default' : 'pointer', ...childElement.props.style },
    })
  ) : (
    <span
      ref={setReference}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      style={isDisabled ? DISABLED_TRIGGER_STYLE : ENABLED_TRIGGER_STYLE}
      {...getReferenceProps(triggerAriaProps)}
    >
      {trigger}
    </span>
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      {triggerElement}
      {open && (
        <FloatingPortal root={boundary}>
          <FloatingFocusManager context={context} modal={modal}>
            <div
              ref={setFloating}
              style={{ ...floatingStyles, ...style }}
              className={classNames(popupStyles.wrapper, className)}
              data-testid={dataTestId}
              {...getFloatingProps()}
              id={surfaceId}
              role="dialog"
              {...labelProps}
            >
              <PopupArrow ref={setArrowElement} context={context} arrowSpec={POPOVER_ARROW} />
              <div className={popupStyles.container}>
                <div className={popupStyles.content}>{children}</div>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </PopoverContext.Provider>
  );
};

PopoverRoot.displayName = 'Popover.Root';

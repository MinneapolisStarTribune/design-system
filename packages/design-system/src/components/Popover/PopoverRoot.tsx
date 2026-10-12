'use client';

import { isValidElement, useId, useMemo, useState } from 'react';
import classNames from 'classnames';
import {
  FloatingFocusManager,
  FloatingPortal,
  useClick,
  useDismiss,
  useInteractions,
  useMergeRefs,
} from '@floating-ui/react';
import { PopoverContext } from './PopoverContext';
import {
  cloneTrigger,
  PopupArrow,
  popupStyles,
  usePopup,
} from '@/components/FloatingPopup/FloatingPopup';
import type {
  PopupArrowSpec,
  PopupTriggerProps,
} from '@/components/FloatingPopup/FloatingPopup.types';
import { PopoverProps } from './Popover.types';

/** The arrow can reach the corners. */
const POPOVER_ARROW_SPEC: PopupArrowSpec = { width: 16, height: 8, cornerInset: 0 };

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
  const generatedId = useId();
  const surfaceId = id ?? generatedId;
  const headingId = useId();
  const [hasHeading, setHasHeading] = useState(false);
  const boundary = portalRoot ?? undefined;
  const {
    open,
    setOpen,
    setArrowElement,
    refs: { setReference, setFloating },
    context,
    floatingStyles,
  } = usePopup({
    open: openProp,
    onOpenChange: onOpenChangeProp,
    placement,
    disabled: isDisabled,
    boundary,
    arrowSpec: POPOVER_ARROW_SPEC,
  });
  const click = useClick(context, { enabled: !isDisabled });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  // Memoize context value to prevent unnecessary re-renders of all
  // context consumers when this component re-renders for unrelated reasons.
  const contextValue = useMemo(
    () => ({ close: () => setOpen(false), headingId, setHasHeading }),
    [setOpen, headingId]
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
    cloneTrigger(
      childElement,
      triggerRef,
      getReferenceProps(triggerAriaProps),
      isDisabled ? 'default' : 'pointer'
    )
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
              <PopupArrow ref={setArrowElement} context={context} arrowSpec={POPOVER_ARROW_SPEC} />
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

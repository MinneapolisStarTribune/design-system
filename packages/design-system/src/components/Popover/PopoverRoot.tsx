'use client';

import { isValidElement, useId, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useClick, useDismiss, useInteractions, useMergeRefs } from '@floating-ui/react';
import { PopoverContext } from './PopoverContext';
import {
  cloneTrigger,
  FloatingPopupSurface,
  PopupArrow,
  popupStyles,
} from '@/components/FloatingPopup/FloatingPopup';
import {
  createAnchoredMiddleware,
  useFloatingPopup,
} from '@/components/FloatingPopup/useFloatingPopup';
import type {
  PopupArrowSpec,
  PopupTriggerProps,
} from '@/components/FloatingPopup/FloatingPopup.types';
import { resolveResponsive, useBreakpoint } from '@/hooks/useResponsiveValue';
import { PopoverProps } from './Popover.types';

/** Size from the Core Components Popover design. The arrow stays clear of the rounded corners. */
const POPOVER_ARROW_SPEC: PopupArrowSpec = { width: 10, height: 6, cornerInset: 16 };

const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

export const PopoverRoot: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement: placementProp,
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
  const breakpoint = useBreakpoint();
  const placement = resolveResponsive(placementProp, breakpoint) ?? 'bottom';
  const {
    open,
    setOpen,
    setArrowElement,
    refs: { setReference, setFloating },
    context,
    floatingStyles,
  } = useFloatingPopup({
    open: openProp,
    onOpenChange: onOpenChangeProp,
    placement,
    disabled: isDisabled,
    middleware: createAnchoredMiddleware({ boundary, arrowSpec: POPOVER_ARROW_SPEC }),
  });
  const click = useClick(context, { enabled: !isDisabled });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

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
      <FloatingPopupSurface
        context={context}
        setFloating={setFloating}
        floatingStyles={floatingStyles}
        portalProps={{ root: boundary }}
        focusProps={{ modal }}
        style={style}
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
      </FloatingPopupSurface>
    </PopoverContext.Provider>
  );
};

PopoverRoot.displayName = 'Popover.Root';

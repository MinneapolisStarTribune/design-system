'use client';

import { useCallback, useId, useMemo, useState } from 'react';
import { useExternalTrigger } from '@/hooks/useExternalTrigger';
import { FloatingSurface } from '@/components/Popover/FloatingSurface';
import { PopoverContext } from '@/components/Popover/PopoverContext';
import { TriggerablePopoverProps } from './TriggerablePopover.types';

export const TriggerablePopoverRoot: React.FC<TriggerablePopoverProps> = ({
  trigger,
  children,
  triggerId,
  enableInjectionSlot = false,
  placement = 'bottom',
  isDisabled,
  modal = false,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  portalRoot,
  className,
  id,
  style,
  'aria-label': ariaLabel,
  externalTriggerOptions,
}) => {
  const headingId = useId();
  const [hasHeading, setHasHeading] = useState(false);

  const { open, handleOpenChange, isExternallyTriggered, forceMount, injectionSlotProps } =
    useExternalTrigger(triggerId, openProp, onOpenChangeProp, {
      ...externalTriggerOptions,
      enableInjectionSlot,
    });

  const guardedHandleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isDisabled && nextOpen) return;
      handleOpenChange(nextOpen);
    },
    [isDisabled, handleOpenChange]
  );

  const contextValue = useMemo(
    () => ({ close: () => handleOpenChange(false), headingId, setHasHeading }),
    [handleOpenChange, headingId]
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      <FloatingSurface
        trigger={trigger}
        open={open}
        onOpenChange={guardedHandleOpenChange}
        placement={placement}
        isDisabled={isDisabled}
        modal={modal}
        keepMounted={forceMount}
        portalRoot={portalRoot}
        wrapperClassName={className}
        id={id}
        style={style}
        aria-label={hasHeading ? undefined : ariaLabel}
        aria-labelledby={hasHeading ? headingId : undefined}
      >
        {!isExternallyTriggered && children}
        {injectionSlotProps && <div {...injectionSlotProps} />}
      </FloatingSurface>
    </PopoverContext.Provider>
  );
};

TriggerablePopoverRoot.displayName = 'TriggerablePopover.Root';

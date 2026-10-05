'use client';

import { useCallback, useId, useMemo, useState } from 'react';
import { useExternalTrigger } from '@/hooks/useExternalTrigger';
import { FloatingSurface } from '@/components/Popover/FloatingSurface';
import { PopoverBody } from '@/components/Popover/PopoverBody';
import { PopoverContext } from '@/components/Popover/PopoverContext';
import { PopoverDescription } from '@/components/Popover/PopoverDescription';
import { PopoverDivider } from '@/components/Popover/PopoverDivider';
import { PopoverHeading } from '@/components/Popover/PopoverHeading';
import { TriggerablePopoverProps } from './TriggerablePopover.types';

const TriggerablePopoverRoot: React.FC<TriggerablePopoverProps> = ({
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

/* Compound API: reuses Popover's sub-components directly; they only depend on PopoverContext. */

type TriggerablePopoverComponent = React.FC<TriggerablePopoverProps> & {
  Heading: typeof PopoverHeading;
  Description: typeof PopoverDescription;
  Body: typeof PopoverBody;
  Divider: typeof PopoverDivider;
};

export const TriggerablePopover = TriggerablePopoverRoot as TriggerablePopoverComponent;

TriggerablePopover.Heading = PopoverHeading;
TriggerablePopover.Body = PopoverBody;
TriggerablePopover.Description = PopoverDescription;
TriggerablePopover.Divider = PopoverDivider;

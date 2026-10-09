'use client';

import { useCallback, useId, useMemo, useState } from 'react';
import { PopoverContext } from './PopoverContext';
import { FloatingSurface } from './FloatingSurface';
import { PopoverProps } from './Popover.types';

export const PopoverRoot: React.FC<PopoverProps> = ({
  trigger,
  children,
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
  dataTestId,
}) => {
  const [openState, setOpenState] = useState(false);
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
  // Memoize context value to prevent unnecessary re-renders of all
  // context consumers when this component re-renders for unrelated reasons.
  const contextValue = useMemo(
    () => ({ close: () => handleOpenChange(false), headingId, setHasHeading }),
    [handleOpenChange, headingId]
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      <FloatingSurface
        trigger={trigger}
        open={open}
        onOpenChange={handleOpenChange}
        placement={placement}
        isDisabled={isDisabled}
        modal={modal}
        portalRoot={portalRoot}
        className={className}
        id={id}
        style={style}
        dataTestId={dataTestId}
        aria-label={hasHeading ? undefined : ariaLabel}
        aria-labelledby={hasHeading ? headingId : undefined}
      >
        {children}
      </FloatingSurface>
    </PopoverContext.Provider>
  );
};

PopoverRoot.displayName = 'Popover.Root';

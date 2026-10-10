'use client';

import { useCallback, useId, useMemo, useState } from 'react';
import { PopoverContext } from './PopoverContext';
import { FloatingSurface } from './FloatingSurface';
import { FloatingTrigger } from './FloatingTrigger';
import { PopoverProps } from './Popover.types';

const POPUP_ROLE = 'dialog';

export const PopoverRoot: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  isDisabled,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  id,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const [openState, setOpenState] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
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
  // Memoize context value to prevent unnecessary re-renders of all
  // context consumers when this component re-renders for unrelated reasons.
  const contextValue = useMemo(
    () => ({ close: () => handleOpenChange(false), headingId, setHasHeading }),
    [handleOpenChange, headingId]
  );
  // A heading names the dialog when present. Otherwise `aria-label` does.
  const labelProps = hasHeading ? { 'aria-labelledby': headingId } : { 'aria-label': ariaLabel };

  return (
    <PopoverContext.Provider value={contextValue}>
      <FloatingTrigger
        trigger={trigger}
        open={open}
        onOpenChange={handleOpenChange}
        popupRole={POPUP_ROLE}
        surfaceId={surfaceId}
        onElementChange={setAnchorElement}
        isDisabled={isDisabled}
      />
      <FloatingSurface
        {...rest}
        {...labelProps}
        anchor={anchorElement}
        open={open}
        onOpenChange={handleOpenChange}
        placement={placement}
        role={POPUP_ROLE}
        id={surfaceId}
      >
        {children}
      </FloatingSurface>
    </PopoverContext.Provider>
  );
};

PopoverRoot.displayName = 'Popover.Root';

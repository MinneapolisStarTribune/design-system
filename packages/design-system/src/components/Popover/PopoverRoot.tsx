'use client';

import { useCallback, useId, useMemo, useState } from 'react';
import { useInteractions } from '@floating-ui/react';
import { PopoverContext } from './PopoverContext';
import { FloatingSurface, useFloatingSurface } from './FloatingSurface';
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

  const contextValue = useMemo(
    () => ({ close: () => handleOpenChange(false), headingId, setHasHeading }),
    [handleOpenChange, headingId]
  );

  const surface = useFloatingSurface({
    open,
    onOpenChange: handleOpenChange,
    placement,
    isDisabled,
    portalRoot,
    id,
  });

  const interactions = useInteractions(surface.interactions);

  return (
    <PopoverContext.Provider value={contextValue}>
      <FloatingSurface
        surface={surface}
        interactions={interactions}
        trigger={trigger}
        modal={modal}
        className={className}
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

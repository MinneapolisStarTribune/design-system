'use client';

import { useCallback, useContext, useMemo, useState } from 'react';
import { PopoverBody } from './PopoverBody';
import {
  PopoverContext,
  PopoverPortalRootContext,
  PopoverPortalRootProvider,
} from './PopoverContext';
import { PopoverDescription } from './PopoverDescription';
import { PopoverDivider } from './PopoverDivider';
import { FloatingSurface } from './FloatingSurface';
import { PopoverHeading } from './PopoverHeading';
import { PopoverProps } from './Popover.types';

const PopoverRoot: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  isDisabled,
  modal = false,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  portalRoot: portalRootProp,
  className,
  id,
  style,
  'aria-label': ariaLabel,
}: PopoverProps) => {
  const [openState, setOpenState] = useState(false);
  // Support controlled and uncontrolled modes
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  // Resolve this before installing our own provider. This preserves Popover's historical portal
  // destination: its own provider is for descendant popovers, not for this surface.
  const portalRootFromContext = useContext(PopoverPortalRootContext);
  const resolvedPortalRoot = portalRootProp ?? portalRootFromContext ?? undefined;
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
    () => ({ close: () => handleOpenChange(false) }),
    [handleOpenChange]
  );

  return (
    <PopoverPortalRootProvider>
      <PopoverContext.Provider value={contextValue}>
        <FloatingSurface
          trigger={trigger}
          open={open}
          onOpenChange={handleOpenChange}
          placement={placement}
          isDisabled={isDisabled}
          modal={modal}
          portalRoot={resolvedPortalRoot}
          wrapperClassName={className}
          id={id}
          style={style}
          aria-label={ariaLabel}
        >
          {children}
        </FloatingSurface>
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
};

export const Popover = PopoverRoot as PopoverComponent;
Popover.Heading = PopoverHeading;
Popover.Body = PopoverBody;
Popover.Description = PopoverDescription;
Popover.Divider = PopoverDivider;

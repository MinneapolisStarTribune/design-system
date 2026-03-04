import React, { HTMLAttributes, ReactNode, useState } from 'react';
import { Popover as TamaguiPopover } from '@tamagui/popover';
import styles from './Popover.module.scss';
import { PopoverHeading } from './PopoverHeading';
import { PopoverBody } from './PopoverBody';
import { PopoverDivider } from './PopoverDivider';
import { PopoverDescription } from './PopoverDescription';
import { PopoverContext } from './PopoverContext';

export type Position = 'top' | 'right' | 'bottom' | 'left';

export type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  pointer?: Position;
  isDisabled?: boolean;
  className?: string;
  dataTestId?: string;
} & HTMLAttributes<HTMLDivElement>;

const POINTER_TO_PLACEMENT: Record<Position, 'top' | 'right' | 'bottom' | 'left'> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

const PopoverRoot: React.FC<PopoverProps> = ({
  trigger,
  children,
  pointer = 'right',
  isDisabled,
  className,
  dataTestId,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  const placement = POINTER_TO_PLACEMENT[pointer];

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDisabled) {
      return;
    }

    setOpen(nextOpen);
  };

  const close = () => setOpen(false);

  return (
    <PopoverContext.Provider value={{ close }}>
      <TamaguiPopover open={open} onOpenChange={handleOpenChange} placement={placement}>
        <TamaguiPopover.Trigger>
          <div style={{ display: 'inline-block', cursor: 'pointer' }}>{trigger}</div>
        </TamaguiPopover.Trigger>

        <TamaguiPopover.Content trapFocus>
          <TamaguiPopover.Arrow size="$1" />
          <div className={styles.container} data-testid={dataTestId} {...rest}>
            <div className={`${styles.content} ${className ?? ''}`}>{children}</div>
          </div>
        </TamaguiPopover.Content>
      </TamaguiPopover>
    </PopoverContext.Provider>
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

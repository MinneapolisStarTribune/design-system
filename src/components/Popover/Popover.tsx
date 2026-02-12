import React, { HTMLAttributes, ReactNode } from 'react';
import { Popover as MantinePopover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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

const POINTER_TO_POSITION: Record<Position, 'top' | 'right' | 'bottom' | 'left'> = {
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
}) => {
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const position = POINTER_TO_POSITION[pointer];

  return (
    <PopoverContext.Provider value={{ close }}>
      <MantinePopover
        opened={opened}
        onChange={(setOpened) => (setOpened ? open() : close())}
        position={position}
        withArrow
        arrowSize={6}
        offset={8}
        withinPortal={false}
        disabled={isDisabled}
        closeOnEscape
        closeOnClickOutside
      >
        <MantinePopover.Target>
          <div style={{ display: 'inline-block', cursor: 'pointer' }} onClick={toggle}>
            {trigger}
          </div>
        </MantinePopover.Target>

        <MantinePopover.Dropdown classNames={{ dropdown: styles.container }}>
          <div className={styles.content}>{children}</div>
        </MantinePopover.Dropdown>
      </MantinePopover>
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

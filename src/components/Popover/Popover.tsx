import React from 'react';
import { Popover as MantinePopover, CloseButton } from '@mantine/core';

import classNames from 'classnames';

import styles from './Popover.module.scss';

import { PopoverHeading } from './PopoverHeading';
import { PopoverBody } from './PopoverBody';
import { PopoverDivider } from './PopoverDivider';

import type { PopoverProps } from './Popover.types';
import type { Position } from '@/types/globalTypes';

const POINTER_TO_POSITION: Record<Position, 'top' | 'bottom' | 'left' | 'right'> = {
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
  ...ariaProps
}) => {
  const position = POINTER_TO_POSITION[pointer];

  return (
    <MantinePopover
      position={position}
      withArrow
      arrowSize={6}
      arrowOffset={0}
      arrowPosition="center"
      offset={8}
      withinPortal={false}
      disabled={isDisabled}
      closeOnEscape
      closeOnClickOutside
      middlewares={{
        flip: true,
        shift: true,
      }}
    >
      <MantinePopover.Target>{trigger}</MantinePopover.Target>

      <MantinePopover.Dropdown
        className={classNames(styles.container, className)}
        data-testid={dataTestId}
        role="dialog"
        {...ariaProps}
      >
        <div className={styles.header}>
          <div className={styles.headerContent}>{children}</div>

          <CloseButton aria-label="Close popover" className={styles.closeButton} size="lg" />
        </div>
      </MantinePopover.Dropdown>
    </MantinePopover>
  );
};

/* Compound */

type PopoverComponent = React.FC<PopoverProps> & {
  Heading: typeof PopoverHeading;
  Body: typeof PopoverBody;
  Divider: typeof PopoverDivider;
};

export const Popover = PopoverRoot as PopoverComponent;

Popover.Heading = PopoverHeading;
Popover.Body = PopoverBody;
Popover.Divider = PopoverDivider;

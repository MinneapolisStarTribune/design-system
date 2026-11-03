import React from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';
import type { PopoverSectionProps } from './Popover.types';

/** Supporting text below the heading. */
export const PopoverDescription: React.FC<PopoverSectionProps> = ({
  children,
  className,
  dataTestId,
}) => {
  return (
    <div
      className={classNames(
        styles.description,
        'typography-utility-text-regular-x-small',
        className
      )}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

PopoverDescription.displayName = 'Popover.Description';

import React from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';
import type { PopoverDividerProps } from './Popover.types';

/** Horizontal rule between sections. */
export const PopoverDivider: React.FC<PopoverDividerProps> = ({
  fullBleed = true,
  className,
  dataTestId,
}) => {
  return (
    <div
      className={classNames(styles.divider, fullBleed && styles.dividerFullBleed, className)}
      data-testid={dataTestId}
    />
  );
};

PopoverDivider.displayName = 'Popover.Divider';

import React from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';

export const PopoverDivider: React.FC<{
  fullBleed?: boolean;
  className?: string;
}> = ({ fullBleed = true, className }) => {
  return (
    <div className={classNames(styles.divider, fullBleed && styles.dividerFullBleed, className)} />
  );
};

PopoverDivider.displayName = 'Popover.Divider';

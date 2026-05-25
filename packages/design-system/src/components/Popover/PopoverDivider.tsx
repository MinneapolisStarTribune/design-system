import React from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';

export const PopoverDivider: React.FC<{
  fullBleed?: boolean;
  dividerClassName?: string;
}> = ({ fullBleed = true, dividerClassName }) => {
  return (
    <div
      className={classNames(styles.divider, fullBleed && styles.dividerFullBleed, dividerClassName)}
    />
  );
};

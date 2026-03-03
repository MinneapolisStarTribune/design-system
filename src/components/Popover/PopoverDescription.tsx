import React from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';

export const PopoverDescription: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const typographyClassName = 'typography-utility-text-regular-x-small text-on-light-secondary';

  return (
    <div className={classNames(styles.description, typographyClassName)}>
      {children}
    </div>
  );
};

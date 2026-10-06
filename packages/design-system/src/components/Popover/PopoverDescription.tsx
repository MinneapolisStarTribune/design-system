import React from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';

export const PopoverDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const typographyClassName = 'typography-utility-text-regular-x-small';

  return (
    <div className={classNames(styles.description, typographyClassName, className)}>{children}</div>
  );
};

PopoverDescription.displayName = 'Popover.Description';

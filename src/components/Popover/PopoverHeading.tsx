import React from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';
import { usePopoverContext } from './PopoverContext';
import { Button } from '../index';

export const PopoverHeading: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { close } = usePopoverContext();
  const typographyClassName = 'typography-utility-section-h6 text-on-light-primary';

  return (
    <div className={classNames(styles.header, typographyClassName)}>
      {children}
      <Button
        variant="ghost"
        size="small"
        icon="close"
        aria-label="Close popover"
        className={styles.closeButton}
        onClick={close}
      />
    </div>
  );
};

import React from 'react';
import styles from './Popover.module.scss';

export const PopoverBody: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className={styles.body}>{children}</div>;
};

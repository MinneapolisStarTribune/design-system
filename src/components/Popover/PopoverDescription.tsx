import React from 'react';
import { Box } from '@mantine/core';
import styles from './Popover.module.scss';
import classNames from 'classnames';

export const PopoverDescription: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const typographyClassName = 'typography-utility-text-regular-x-small text-on-light-secondary';
  return <Box className={classNames(styles.description, typographyClassName)}>{children}</Box>;
};

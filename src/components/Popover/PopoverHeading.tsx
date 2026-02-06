import React from 'react';
import { Box } from '@mantine/core';

import styles from './Popover.module.scss';

export const PopoverHeading: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <Box className={styles.heading}>{children}</Box>;
};

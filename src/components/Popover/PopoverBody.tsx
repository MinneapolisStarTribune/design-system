import React from 'react';
import { Box } from '@mantine/core';

import styles from './Popover.module.scss';

export const PopoverBody: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <Box className={styles.body}>{children}</Box>;
};

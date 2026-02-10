import React from 'react';
import { Box, CloseButton } from '@mantine/core';
import styles from './Popover.module.scss';
import { usePopoverContext } from './PopoverContext';

export const PopoverHeading: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { close } = usePopoverContext();

  return (
    <Box className={styles.header}>
      {children}
      <CloseButton
        aria-label="Close popover"
        className={styles.closeButton}
        size="lg"
        onClick={close}
      />
    </Box>
  );
};

import React from 'react';
import { Box, CloseButton } from '@mantine/core';
import styles from './Popover.module.scss';
import { usePopoverContext } from './PopoverContext';
import classNames from 'classnames';

export const PopoverHeading: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { close } = usePopoverContext();
  const typographyClassName = 'typography-utility-section-h6';
  return (
    <Box className={classNames(styles.header, typographyClassName)}>
      <Box className={styles.headerContent}>{children}</Box>
      <CloseButton
        aria-label="Close popover"
        className={styles.closeButton}
        size="md"
        onClick={close}
      />
    </Box>
  );
};

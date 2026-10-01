'use client';

import classNames from 'classnames';
import { ModalFooter } from '@/components/Modal/ModalFooter';
import styles from './Dialog.module.scss';
import type { DialogActionsProps } from './Dialog.types';

/**
 * Action row pinned below the content. On phones the actions stack full width, or sit side by side
 * with `stackOnMobile={false}`; from 768px up they sit at the end of the row, with the first one
 * pushed to the start when there are several.
 */
export const DialogActions: React.FC<DialogActionsProps> = ({
  children,
  className,
  dataTestId,
  stackOnMobile = true,
}) => {
  return (
    <ModalFooter
      componentName="Dialog"
      className={classNames(styles.actions, stackOnMobile && styles.stacked, className)}
      dataTestId={dataTestId}
    >
      {children}
    </ModalFooter>
  );
};

DialogActions.displayName = 'DialogActions';

'use client';

import classNames from 'classnames';
import { ModalFooter } from '@/components/Modal/ModalFooter';
import styles from './Dialog.module.scss';
import type { DialogSectionProps } from './Dialog.types';

/**
 * Action row pinned below the content. Stacks full width on phones; from 768px up the actions sit
 * at the end of the row, with the first one pushed to the start when there are several.
 */
export const DialogActions: React.FC<DialogSectionProps> = ({
  children,
  className,
  dataTestId,
}) => {
  return (
    <ModalFooter
      componentName="Dialog"
      className={classNames(styles.actions, className)}
      dataTestId={dataTestId}
    >
      {children}
    </ModalFooter>
  );
};

DialogActions.displayName = 'DialogActions';

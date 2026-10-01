'use client';

import classNames from 'classnames';
import * as Drawer from '@/components/Drawer/Drawer';
import styles from './Dialog.module.scss';
import { useDialogContext } from './DialogContext';
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
  useDialogContext();

  return (
    <Drawer.Footer className={classNames(styles.actions, className)} dataTestId={dataTestId}>
      {children}
    </Drawer.Footer>
  );
};

DialogActions.displayName = 'DialogActions';

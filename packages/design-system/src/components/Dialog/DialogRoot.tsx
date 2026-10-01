'use client';

import classNames from 'classnames';
import * as Drawer from '@/components/Drawer/Drawer';
import styles from './Dialog.module.scss';
import { DialogContext } from './DialogContext';
import type { DialogProps } from './Dialog.types';

/**
 * A bottom sheet on phones and a centered dialog from 768px up. Built on `Drawer.Root`, which owns
 * the overlay, focus trap, scroll lock, dismissal and transitions; Dialog.module.scss re-centers
 * the panel from 768px up.
 */
export const DialogRoot: React.FC<DialogProps> = ({
  children,
  open,
  onClose,
  showCloseButton = true,
  role = 'dialog',
  describeWithContent,
  closeLabel,
  initialFocus,
  portalRoot,
  className,
  style,
  dataTestId = 'dialog',
  'aria-label': ariaLabel,
}) => {
  return (
    <Drawer.Root
      open={open}
      onClose={onClose}
      position="bottom"
      showCloseButton={showCloseButton}
      role={role}
      describeWithBody={describeWithContent}
      closeLabel={closeLabel}
      initialFocus={initialFocus}
      portalRoot={portalRoot}
      className={classNames(styles.panel, className)}
      style={style}
      dataTestId={dataTestId}
      aria-label={ariaLabel}
    >
      <DialogContext.Provider value>{children}</DialogContext.Provider>
    </Drawer.Root>
  );
};

DialogRoot.displayName = 'Dialog.Root';

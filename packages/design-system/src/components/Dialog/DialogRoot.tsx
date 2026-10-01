'use client';

import classNames from 'classnames';
import { useResponsiveValue } from '@/hooks/useResponsiveValue';
import { ModalRoot } from '@/components/Modal/ModalRoot';
import type { ModalPosition } from '@/components/Modal/Modal.types';
import type { ResponsiveDefault } from '@/types/globalTypes';
import styles from './Dialog.module.scss';
import type { DialogProps } from './Dialog.types';

const POSITION: ResponsiveDefault<ModalPosition> = { small: 'bottom', medium: 'center' };

const NAMES = { component: 'Dialog', heading: 'Title' } as const;

/** A modal window: a bottom sheet on phones, centered from 768px up. Built on the internal `ModalRoot`. */
export const DialogRoot: React.FC<DialogProps> = ({
  children,
  open,
  onClose,
  showCloseButton = true,
  role = 'dialog',
  describeWithContent = role === 'alertdialog',
  closeLabel = 'Close',
  initialFocus,
  portalRoot,
  className,
  style,
  dataTestId = 'dialog',
  'aria-label': ariaLabel,
}) => {
  const position = useResponsiveValue(undefined, POSITION);

  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      position={position}
      showCloseButton={showCloseButton}
      role={role}
      describeWithBody={describeWithContent}
      closeLabel={closeLabel}
      initialFocus={initialFocus}
      portalRoot={portalRoot}
      className={classNames(styles.dialog, className)}
      style={style}
      dataTestId={dataTestId}
      aria-label={ariaLabel}
      names={NAMES}
    >
      {children}
    </ModalRoot>
  );
};

DialogRoot.displayName = 'Dialog.Root';

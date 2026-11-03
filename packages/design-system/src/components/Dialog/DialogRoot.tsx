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
  role = 'dialog',
  describeWithContent = role === 'alertdialog',
  className,
  dataTestId = 'dialog',
  ...rest
}) => {
  const position = useResponsiveValue(undefined, POSITION);

  return (
    <ModalRoot
      {...rest}
      role={role}
      describeWithBody={describeWithContent}
      position={position}
      className={classNames(styles.dialog, className)}
      dataTestId={dataTestId}
      names={NAMES}
    />
  );
};

DialogRoot.displayName = 'Dialog.Root';

'use client';

import classNames from 'classnames';
import type { CSSProperties } from 'react';
import { useResponsiveValue } from '@/hooks/useResponsiveValue';
import { ModalRoot } from '@/components/Modal/ModalRoot';
import type { ModalPosition } from '@/components/Modal/Modal.types';
import type { ResponsiveDefault } from '@/types/globalTypes';
import styles from './Dialog.module.scss';
import type { DialogProps } from './Dialog.types';
import { DIALOG_MAX_WIDTHS } from './Dialog.constants';

const POSITION: ResponsiveDefault<ModalPosition> = { small: 'bottom', medium: 'center' };

const NAMES = { component: 'Dialog', heading: 'Title' } as const;

/** A modal window: a bottom sheet on phones, centered from 768px up. Built on the internal `ModalRoot`. */
export const DialogRoot: React.FC<DialogProps> = ({
  role = 'dialog',
  describeWithContent = role === 'alertdialog',
  className,
  maxWidth = 'md',
  fullWidth = true,
  style,
  dataTestId = 'dialog',
  ...rest
}) => {
  const position = useResponsiveValue(undefined, POSITION);
  const panelStyle: CSSProperties & { '--dialog-max-width': string } = {
    '--dialog-max-width': `${DIALOG_MAX_WIDTHS[maxWidth]}px`,
    ...style,
  };

  return (
    <ModalRoot
      {...rest}
      role={role}
      describeWithBody={describeWithContent}
      position={position}
      className={classNames(styles.dialog, fullWidth && styles.fullWidth, className)}
      style={panelStyle}
      dataTestId={dataTestId}
      names={NAMES}
    />
  );
};

DialogRoot.displayName = 'Dialog.Root';

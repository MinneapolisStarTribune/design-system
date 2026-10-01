'use client';

import { useResponsiveValue } from '@/hooks/useResponsiveValue';
import { ModalRoot } from '@/components/Modal/ModalRoot';
import type { ModalPosition } from '@/components/Modal/Modal.types';
import type { Responsive } from '@/types/globalTypes';
import type { DialogProps } from './Dialog.types';

// A bottom sheet on phones, centered from 768px up. Keep in sync with the actions media query in
// Dialog.module.scss.
const POSITION: Responsive<ModalPosition> = { small: 'bottom', medium: 'center' };

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
  const position = useResponsiveValue(POSITION, POSITION);

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
      className={className}
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

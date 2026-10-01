'use client';

import { ModalBody } from '@/components/Modal/ModalBody';
import type { DialogSectionProps } from './Dialog.types';

/** Main content region; the only part of the dialog that scrolls. */
export const DialogContent: React.FC<DialogSectionProps> = ({
  children,
  className,
  dataTestId,
}) => {
  return (
    <ModalBody componentName="Dialog" className={className} dataTestId={dataTestId}>
      {children}
    </ModalBody>
  );
};

DialogContent.displayName = 'DialogContent';

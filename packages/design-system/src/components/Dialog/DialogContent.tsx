'use client';

import * as Drawer from '@/components/Drawer/Drawer';
import { useDialogContext } from './DialogContext';
import type { DialogSectionProps } from './Dialog.types';

/** Main content region; the only part of the dialog that scrolls. */
export const DialogContent: React.FC<DialogSectionProps> = ({
  children,
  className,
  dataTestId,
}) => {
  useDialogContext();

  return (
    <Drawer.Body className={className} dataTestId={dataTestId}>
      {children}
    </Drawer.Body>
  );
};

DialogContent.displayName = 'DialogContent';

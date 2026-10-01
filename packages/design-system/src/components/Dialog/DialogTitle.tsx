'use client';

import * as Drawer from '@/components/Drawer/Drawer';
import { useDialogContext } from './DialogContext';
import type { DialogSectionProps } from './Dialog.types';

/** Dialog title. Renders an `h2` and names the dialog via `aria-labelledby`. */
export const DialogTitle: React.FC<DialogSectionProps> = ({ children, className, dataTestId }) => {
  useDialogContext();

  return (
    <Drawer.Heading className={className} dataTestId={dataTestId}>
      {children}
    </Drawer.Heading>
  );
};

DialogTitle.displayName = 'DialogTitle';

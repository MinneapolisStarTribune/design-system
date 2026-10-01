'use client';

import { ModalHeading } from '@/components/Modal/ModalHeading';
import type { DialogSectionProps } from './Dialog.types';

/** Dialog title. Renders an `h2` and names the dialog via `aria-labelledby`. */
export const DialogTitle: React.FC<DialogSectionProps> = ({ children, className, dataTestId }) => {
  return (
    <ModalHeading componentName="Dialog" className={className} dataTestId={dataTestId}>
      {children}
    </ModalHeading>
  );
};

DialogTitle.displayName = 'DialogTitle';

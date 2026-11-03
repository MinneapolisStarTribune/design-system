'use client';

import { ModalHeading } from '@/components/Modal/ModalHeading';
import type { DialogTitleProps } from './Dialog.types';

/** Dialog title. Renders an `h2` by default and names the dialog via `aria-labelledby`. */
export const DialogTitle: React.FC<DialogTitleProps> = ({
  as,
  children,
  className,
  dataTestId,
}) => {
  return (
    <ModalHeading componentName="Dialog" as={as} className={className} dataTestId={dataTestId}>
      {children}
    </ModalHeading>
  );
};

DialogTitle.displayName = 'DialogTitle';

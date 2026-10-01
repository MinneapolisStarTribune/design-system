'use client';

import { ModalBody } from '@/components/Modal/ModalBody';
import type { DrawerSectionProps } from './Drawer.types';

/** Main content region; the only part of the panel that scrolls. */
export const DrawerBody: React.FC<DrawerSectionProps> = ({ children, className, dataTestId }) => {
  return (
    <ModalBody componentName="Drawer" className={className} dataTestId={dataTestId}>
      {children}
    </ModalBody>
  );
};

DrawerBody.displayName = 'DrawerBody';

'use client';

import { ModalFooter } from '@/components/Modal/ModalFooter';
import type { DrawerSectionProps } from './Drawer.types';

/** Action row pinned below the body. */
export const DrawerFooter: React.FC<DrawerSectionProps> = ({ children, className, dataTestId }) => {
  return (
    <ModalFooter componentName="Drawer" className={className} dataTestId={dataTestId}>
      {children}
    </ModalFooter>
  );
};

DrawerFooter.displayName = 'DrawerFooter';

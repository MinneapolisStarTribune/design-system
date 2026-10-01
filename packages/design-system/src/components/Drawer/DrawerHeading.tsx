'use client';

import { ModalHeading } from '@/components/Modal/ModalHeading';
import type { DrawerSectionProps } from './Drawer.types';

/** Drawer title. Renders an `h2` and names the drawer via `aria-labelledby`. */
export const DrawerHeading: React.FC<DrawerSectionProps> = ({
  children,
  className,
  dataTestId,
}) => {
  return (
    <ModalHeading componentName="Drawer" className={className} dataTestId={dataTestId}>
      {children}
    </ModalHeading>
  );
};

DrawerHeading.displayName = 'DrawerHeading';

'use client';

import { ModalHeading } from '@/components/Modal/ModalHeading';
import type { DrawerHeadingProps } from './Drawer.types';

/** Drawer title. Renders an `h2` by default and names the drawer via `aria-labelledby`. */
export const DrawerHeading: React.FC<DrawerHeadingProps> = ({
  as,
  children,
  className,
  dataTestId,
}) => {
  return (
    <ModalHeading componentName="Drawer" as={as} className={className} dataTestId={dataTestId}>
      {children}
    </ModalHeading>
  );
};

DrawerHeading.displayName = 'DrawerHeading';

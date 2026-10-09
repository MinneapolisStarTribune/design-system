'use client';

import { useResponsiveValue } from '@/hooks/useResponsiveValue';
import { ModalRoot } from '@/components/Modal/ModalRoot';
import type { ResponsiveDefault } from '@/types/globalTypes';
import type { DrawerPosition, DrawerProps } from './Drawer.types';

// A bottom sheet on phones, a right side panel from 768px up.
const DEFAULT_POSITION: ResponsiveDefault<DrawerPosition> = { small: 'bottom', medium: 'right' };

const NAMES = { component: 'Drawer', heading: 'Heading' } as const;

/** A modal panel attached to a viewport edge. Built on the internal `ModalRoot`. */
export const DrawerRoot: React.FC<DrawerProps> = ({
  position,
  role = 'dialog',
  describeWithBody = role === 'alertdialog',
  dataTestId = 'drawer',
  ...rest
}) => {
  const resolvedPosition = useResponsiveValue(position, DEFAULT_POSITION);

  return (
    <ModalRoot
      {...rest}
      role={role}
      describeWithBody={describeWithBody}
      position={resolvedPosition}
      dataTestId={dataTestId}
      names={NAMES}
    />
  );
};

DrawerRoot.displayName = 'Drawer.Root';

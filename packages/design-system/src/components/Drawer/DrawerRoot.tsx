'use client';

import { useResponsiveValue } from '@/hooks/useResponsiveValue';
import { ModalRoot } from '@/components/Modal/ModalRoot';
import type { Responsive } from '@/types/globalTypes';
import type { DrawerPosition, DrawerProps } from './Drawer.types';

// A bottom sheet on phones, a right side panel from 768px up.
const DEFAULT_POSITION: Responsive<DrawerPosition> = { small: 'bottom', medium: 'right' };

const NAMES = { component: 'Drawer', heading: 'Heading' } as const;

/** A modal panel attached to a viewport edge. Built on the internal `ModalRoot`. */
export const DrawerRoot: React.FC<DrawerProps> = ({
  children,
  open,
  onClose,
  position,
  showCloseButton = true,
  role = 'dialog',
  describeWithBody = role === 'alertdialog',
  closeLabel = 'Close',
  initialFocus,
  portalRoot,
  className,
  style,
  dataTestId = 'drawer',
  'aria-label': ariaLabel,
}) => {
  const resolvedPosition = useResponsiveValue(position, DEFAULT_POSITION);

  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      position={resolvedPosition}
      showCloseButton={showCloseButton}
      role={role}
      describeWithBody={describeWithBody}
      closeLabel={closeLabel}
      initialFocus={initialFocus}
      portalRoot={portalRoot}
      className={className}
      style={style}
      dataTestId={dataTestId}
      aria-label={ariaLabel}
      names={NAMES}
    >
      {children}
    </ModalRoot>
  );
};

DrawerRoot.displayName = 'Drawer.Root';

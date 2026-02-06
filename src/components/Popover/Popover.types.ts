import type { ReactNode } from 'react';
import { AccessibilityProps, BaseProps, Position } from '@/types/globalTypes';

export interface PopoverProps extends BaseProps, AccessibilityProps {
  /** Trigger element */
  trigger: ReactNode;

  /** Content */
  children: ReactNode;

  /** Pointer direction */
  pointer?: Position;

  /** Disable */
  isDisabled?: boolean;
}

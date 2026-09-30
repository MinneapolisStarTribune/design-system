import type { ReactNode, RefObject } from 'react';
import type { AccessibilityProps, BaseProps } from '@/types/globalTypes';

export const DRAWER_POSITIONS = ['left', 'right', 'top', 'bottom'] as const;
export type DrawerPosition = (typeof DRAWER_POSITIONS)[number];

export interface DrawerProps extends BaseProps, Pick<AccessibilityProps, 'aria-label'> {
  /** Drawer content. Compose with `Drawer.Heading`, `Drawer.Body` and `Drawer.Footer`. */
  children: ReactNode;
  /** Whether the drawer is open. */
  open: boolean;
  /**
   * Called when the drawer requests a close — via the X icon button, Escape or an overlay press.
   * Set `open` to `false` in response. Footer actions set it themselves.
   */
  onClose: () => void;
  /**
   * The edge the drawer is attached to at 768px and up.
   * @default 'right'
   */
  position?: DrawerPosition;
  /**
   * The edge the drawer is attached to at 767px and below.
   * @default 'bottom'
   */
  mobilePosition?: DrawerPosition;
  /**
   * Whether the top-right X icon button is rendered.
   * @default true
   */
  showCloseButton?: boolean;
  /** Element to focus when the drawer opens. Defaults to the panel itself. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** When set, the drawer renders into this element instead of `document.body` (e.g. for Storybook). */
  portalRoot?: HTMLElement | null;
  /** Accessible label for the drawer. Provide this when no `Drawer.Heading` is rendered. */
  'aria-label'?: string;
  /**
   * Test id for the panel; also used as the prefix for `-overlay` and `-close-button`.
   * @default 'drawer'
   */
  dataTestId?: string;
}

export interface DrawerSectionProps extends Pick<BaseProps, 'className' | 'dataTestId'> {
  children: ReactNode;
}

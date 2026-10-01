import type { ReactNode, RefObject } from 'react';
import type { AccessibilityProps, BaseProps, Responsive } from '@/types/globalTypes';
import type { DRAWER_POSITIONS } from './Drawer.constants';

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
   * The edge the drawer is attached to. Pass one edge for every screen size, or an object keyed
   * by breakpoint (`small`, `medium` 768px+, `large` 1160px+); each key applies from that
   * breakpoint up, and sizes below the smallest key use the default.
   * @default { small: 'bottom', medium: 'right' }
   */
  position?: Responsive<DrawerPosition>;
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

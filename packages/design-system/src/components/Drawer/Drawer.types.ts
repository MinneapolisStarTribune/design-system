import type { ReactNode, RefObject } from 'react';
import type { AccessibilityProps, BaseProps, Responsive } from '@/types/globalTypes';
import type { DRAWER_CLOSE_REASONS, DRAWER_POSITIONS, DRAWER_ROLES } from './Drawer.constants';

export type DrawerPosition = (typeof DRAWER_POSITIONS)[number];
export type DrawerRole = (typeof DRAWER_ROLES)[number];
export type DrawerCloseReason = (typeof DRAWER_CLOSE_REASONS)[number];

export interface DrawerProps extends BaseProps, Pick<AccessibilityProps, 'aria-label'> {
  /** Drawer content. Compose with `Drawer.Heading`, `Drawer.Body` and `Drawer.Footer`. */
  children: ReactNode;
  /** Whether the drawer is open. */
  open: boolean;
  /**
   * Called when the drawer requests a close — via the X icon button, Escape or an overlay press —
   * with what triggered it (`'closeButton' | 'escapeKey' | 'overlayPress'`). Set `open` to `false`
   * in response, or ignore a reason (e.g. `'overlayPress'` while a form has unsaved input). Footer
   * actions set it themselves.
   */
  onClose: (reason: DrawerCloseReason) => void;
  /**
   * The ARIA role. Use `alertdialog` for urgent interruptions that need a response, like
   * confirming a deletion.
   * @default 'dialog'
   */
  role?: DrawerRole;
  /**
   * Whether `Drawer.Body` describes the drawer via `aria-describedby`, so screen readers announce it
   * with the name. Keep it for short messages; long or interactive content is noisy when read out.
   * @default true for `role="alertdialog"`, false otherwise
   */
  describeWithBody?: boolean;
  /**
   * Accessible label for the X icon button.
   * @default 'Close'
   */
  closeLabel?: string;
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

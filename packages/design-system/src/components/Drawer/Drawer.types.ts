import type { ReactNode, RefObject } from 'react';
import type { AccessibilityProps, BaseProps } from '@/types/globalTypes';

export const DRAWER_POSITIONS = ['left', 'right', 'bottom'] as const;
export type DrawerPosition = (typeof DRAWER_POSITIONS)[number];

export interface DrawerProps extends BaseProps, Pick<AccessibilityProps, 'aria-label'> {
  /** Drawer content. Compose with `Drawer.Heading`, `Drawer.Description`, `Drawer.Body` and `Drawer.Footer`. */
  children: ReactNode;
  /** Element that opens the drawer on click. Omit it when controlling `open` yourself. */
  trigger?: ReactNode;
  /** Controlled open state. If omitted, the component manages open state internally. */
  open?: boolean;
  /** Called when the drawer requests an open/close transition. Required when `open` is provided. */
  onOpenChange?: (open: boolean) => void;
  /**
   * The edge the drawer is attached to at 768px and up.
   * @default 'right'
   */
  position?: DrawerPosition;
  /** The edge the drawer is attached to at 767px and below. Defaults to `position`. */
  mobilePosition?: DrawerPosition;
  /**
   * Whether Escape or a press on the overlay dismisses the drawer.
   * @default true
   */
  isDismissable?: boolean;
  /**
   * Whether the top-right close button is rendered.
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Accessible name of the close button.
   * @default 'Close'
   */
  closeButtonLabel?: string;
  /** Element to focus when the drawer opens. Defaults to the panel itself. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** When set, the drawer renders into this element instead of `document.body` (e.g. for Storybook). */
  portalRoot?: HTMLElement | null;
  /** Applied to the full-screen overlay behind the drawer. */
  overlayClassName?: string;
  /** Applied to the wrapper around `children`, inside the panel. */
  contentClassName?: string;
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

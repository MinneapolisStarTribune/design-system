import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import type { BaseProps, IconPosition, Position } from '@/types';
import type {
  MENU_ARROW_OFFSETS,
  MENU_CLOSE_REASONS,
  MENU_HORIZONTAL_ORIGINS,
  MENU_VERTICAL_ORIGINS,
} from './Menu.constants';

/** The Floating UI placement that the origins map to. */
export type MenuPlacement = Position | `${Position}-${'start' | 'end'}`;

/** A point on the anchor or the menu. */
export type MenuOrigin = {
  vertical: (typeof MENU_VERTICAL_ORIGINS)[number];
  horizontal: (typeof MENU_HORIZONTAL_ORIGINS)[number];
};

/** Arrow position along the menu edge that faces the anchor. */
export type MenuArrowOffset = (typeof MENU_ARROW_OFFSETS)[number];

export type MenuCloseReason = (typeof MENU_CLOSE_REASONS)[number];

// TODO: After #439 (Drawer) merges, let `anchorOrigin`, `transformOrigin` and `arrowOffset` accept
// `Responsive<T>`, and resolve them with `useResponsiveValue`.
export type MenuBaseProps = Pick<BaseProps, 'dataTestId'> & {
  children: ReactNode;
  open: boolean;
  /** Called when the menu requests to close. Receives the reason. */
  onClose?: (reason: MenuCloseReason) => void;
  /**
   * Point on the anchor that the menu attaches to.
   * @default { vertical: 'bottom', horizontal: 'left' }
   */
  anchorOrigin?: MenuOrigin;
  /**
   * Point on the menu that attaches to `anchorOrigin`. If the origins put the menu over the anchor,
   * the menu hides the arrow.
   * @default { vertical: 'top', horizontal: 'left' }
   */
  transformOrigin?: MenuOrigin;
  /**
   * Hides the arrow.
   * @default false
   */
  hideArrow?: boolean;
  /**
   * Sets a fixed arrow position along the menu edge that faces the anchor. The arrow stays 16px
   * from the rounded corners. When not set, the arrow points at the center of the anchor.
   */
  arrowOffset?: MenuArrowOffset;
  /** Class for the menu surface. Use it to set `--menu-width`, `--menu-max-height` and `--menu-item-min-height`. */
  className?: string;
};

/** A menu needs an accessible name: exactly one of `aria-label` or `aria-labelledby`. */
export type MenuLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type MenuProps = MenuBaseProps &
  MenuLabelProps &
  Pick<HTMLAttributes<HTMLDivElement>, 'id'> & {
    /** When set, the menu renders into this element instead of `document.body` (e.g. for Storybook). */
    portalRoot?: HTMLElement | null;
    /** Element the menu is positioned against. */
    anchorEl: Element | null;
  };

type MenuItemBaseProps = Pick<BaseProps, 'dataTestId'> & {
  children: ReactNode;
  disabled?: boolean;
  /**
   * Whether selecting this item closes the menu.
   * @default true
   */
  closeOnSelect?: boolean;
};

export type MenuItemButtonProps = MenuItemBaseProps &
  Omit<ComponentProps<'button'>, keyof MenuItemBaseProps | 'type' | 'role'> & { href?: undefined };

export type MenuItemLinkProps = MenuItemBaseProps &
  Omit<ComponentProps<'a'>, keyof MenuItemBaseProps | 'role'> & { href: string };

export type MenuItemProps = MenuItemButtonProps | MenuItemLinkProps;

export type MenuItemIconProps = Pick<BaseProps, 'dataTestId'> & {
  children: ReactNode;
  /**
   * Which side of the label the icon sits on.
   * @default 'start'
   */
  position?: IconPosition;
  className?: string;
};

export type MenuDividerProps = Pick<BaseProps, 'dataTestId'> & {
  className?: string;
};

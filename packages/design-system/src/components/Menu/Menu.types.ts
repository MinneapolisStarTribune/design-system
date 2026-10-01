import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import type { IconPosition, Position } from '@/types';

export type MenuPlacement = Position | `${Position}-${'start' | 'end'}`;

export const MENU_VERTICAL_ORIGINS = ['top', 'center', 'bottom'] as const;
export const MENU_HORIZONTAL_ORIGINS = ['left', 'center', 'right'] as const;

/** A point on the anchor or the menu, used to derive where the menu sits. */
export type MenuOrigin = {
  vertical: (typeof MENU_VERTICAL_ORIGINS)[number];
  horizontal: (typeof MENU_HORIZONTAL_ORIGINS)[number];
};

/** Position of the pointer along the relevant menu edge. CSS lengths and percentages are accepted. */
export type MenuArrowOffset = 'start' | 'center' | 'end' | string | number | null;

export type MenuBaseProps = {
  children: ReactNode;
  open: boolean;
  /** Called when the menu asks to close: dismiss gestures, keys, or item selection. */
  onClose?: () => void;
  /** Point on the anchor the menu attaches to. Defaults to `{ vertical: 'bottom', horizontal: 'left' }`. */
  anchorOrigin?: MenuOrigin;
  /** Point on the menu that attaches to `anchorOrigin`. Defaults to `{ vertical: 'top', horizontal: 'left' }`. */
  transformOrigin?: MenuOrigin;
  /** Overrides `anchorOrigin`/`transformOrigin` with a side and alignment such as 'right-end'. */
  placement?: MenuPlacement;
  /** Whether selecting an item closes the menu. Items can override this. Defaults to true. */
  closeOnSelect?: boolean;
  /** Hides the pointer arrow. Defaults to false. */
  hideArrow?: boolean;
  /**
   * Pins the pointer along the menu edge that faces the anchor. Unset or null aims it at the
   * anchor's center. 'start', 'center' and 'end' keep 16px clear of the rounded corners; a number
   * or CSS length is measured from the edge the menu is aligned to.
   */
  arrowOffset?: MenuArrowOffset;
  /** Surface width. A number is in pixels; strings accept any CSS length. Defaults to Core Components' 360px. */
  surfaceWidth?: number | string;
  /** Minimum item-row height. A number is in pixels; strings accept any CSS length. Defaults to Core Components' 43px. */
  itemMinHeight?: number | string;
  /** Maximum list height before it scrolls. A number is in pixels; strings accept any CSS length. Defaults to Core Components' 362px. */
  maxHeight?: number | string;
};

/** A menu needs an accessible name: exactly one of `aria-label` or `aria-labelledby`. */
export type MenuLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type MenuProps = MenuBaseProps &
  MenuLabelProps &
  Pick<HTMLAttributes<HTMLDivElement>, 'id' | 'style'> & {
    portalRoot?: HTMLElement | null;
    wrapperClassName?: string;
    containerClassName?: string;
    contentClassName?: string;
    arrowClassName?: string;
    /** Element the menu is positioned against. Called on Escape, outside click, or focus leaving. */
    anchorEl: Element | null;
  };

type MenuItemBaseProps = {
  children: ReactNode;
  disabled?: boolean;
  /** Overrides the menu's `closeOnSelect` for this item. */
  closeOnSelect?: boolean;
};

export type MenuItemButtonProps = MenuItemBaseProps &
  Omit<ComponentProps<'button'>, keyof MenuItemBaseProps | 'type' | 'role'> & { href?: undefined };

export type MenuItemLinkProps = MenuItemBaseProps &
  Omit<ComponentProps<'a'>, keyof MenuItemBaseProps | 'role'> & { href: string };

export type MenuItemProps = MenuItemButtonProps | MenuItemLinkProps;

export type MenuItemIconProps = {
  children: ReactNode;
  /** Which side of the label the icon sits on. Defaults to 'start'. */
  position?: IconPosition;
  className?: string;
};

export type MenuDividerProps = {
  className?: string;
};

import type { ComponentProps, HTMLAttributes, ReactElement, ReactNode } from 'react';
import type { BaseProps, IconPosition, Position } from '@/types';
import type { Responsive } from '@/types/globalTypes';
import type {
  MENU_ARROW_OFFSETS,
  MENU_CLOSE_REASONS,
  MENU_HORIZONTAL_ORIGINS,
  MENU_VERTICAL_ORIGINS,
} from './Menu.constants';

/** Floating UI placement for the origins. */
export type MenuPlacement = Position | `${Position}-${'start' | 'end'}`;

/** A point on the anchor or the menu. */
export type MenuOrigin = {
  vertical: (typeof MENU_VERTICAL_ORIGINS)[number];
  horizontal: (typeof MENU_HORIZONTAL_ORIGINS)[number];
};

/** Arrow position along the menu edge that faces the anchor. */
export type MenuArrowOffset = (typeof MENU_ARROW_OFFSETS)[number];

export type MenuCloseReason = (typeof MENU_CLOSE_REASONS)[number];

export type MenuBaseProps = Pick<BaseProps, 'dataTestId'> & {
  children: ReactNode;
  open: boolean;
  /** Called when the menu requests to close. Receives a reason. */
  onClose: (reason: MenuCloseReason) => void;
  /**
   * Point on the anchor that the menu attaches to. Accepts a value per breakpoint.
   * @default { vertical: 'bottom', horizontal: 'left' }
   */
  anchorOrigin?: Responsive<MenuOrigin>;
  /**
   * Point on the menu that attaches to `anchorOrigin`. Accepts a value per breakpoint.
   * The menu hides the arrow when the origins place it over the anchor.
   * @default { vertical: 'top', horizontal: 'left' }
   */
  transformOrigin?: Responsive<MenuOrigin>;
  /**
   * Hides the arrow.
   * @default false
   */
  hideArrow?: boolean;
  /**
   * Sets a fixed arrow position on the menu edge that faces the anchor.
   * The arrow stays 16px from the rounded corners. By default, it points to the anchor center.
   * Accepts a value per breakpoint. Breakpoints without a value use the default.
   */
  arrowOffset?: Responsive<MenuArrowOffset>;
  /** Classes for the menu surface. */
  className?: string;
};

/** A menu needs exactly one accessible name. */
export type MenuLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

/** Menu renders and wires a `trigger`, or attaches to an `anchorEl` the consumer renders. */
export type MenuAnchorProps =
  | {
      /**
       * Element that toggles the menu. It must be a single element that accepts a ref. The menu
       * adds its click handler, `aria-haspopup`, `aria-expanded`, and `aria-controls`.
       */
      trigger: ReactElement;
      /** Called when the trigger requests to open the menu. */
      onOpen: () => void;
      anchorEl?: never;
    }
  | {
      /** The element the menu is positioned against. */
      anchorEl: Element | null;
      trigger?: never;
      onOpen?: never;
    };

export type MenuProps = MenuBaseProps &
  MenuLabelProps &
  MenuAnchorProps &
  Pick<HTMLAttributes<HTMLDivElement>, 'id'> & {
    /** Renders the menu in this element instead of `document.body` (e.g. for Storybook). */
    portalRoot?: HTMLElement | null;
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

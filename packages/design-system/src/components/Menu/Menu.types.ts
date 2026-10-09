import type { ComponentProps, ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import type { ButtonRouterLinkProps } from '@/components/Button/web/Button.types';
import type { BaseProps, IconPosition, Position } from '@/types';
import type { Responsive } from '@/types/globalTypes';
import type { MENU_ARROW_OFFSETS, MENU_CLOSE_REASONS } from './Menu.constants';

/** Side of the anchor the menu opens on, with an optional `-start` or `-end` edge alignment. */
export type MenuPlacement = Position | `${Position}-${'start' | 'end'}`;

/** Arrow position along the menu edge that faces the anchor. */
export type MenuArrowOffset = (typeof MENU_ARROW_OFFSETS)[number];

export type MenuCloseReason = (typeof MENU_CLOSE_REASONS)[number];

export type MenuBaseProps = Pick<BaseProps, 'className' | 'dataTestId'> & {
  children: ReactNode;
  open: boolean;
  /** Called when the menu requests to close. Receives a reason. */
  onClose: (reason: MenuCloseReason) => void;
  /**
   * Where the menu opens relative to the anchor. Accepts a value per breakpoint.
   * @default 'bottom-start'
   */
  placement?: Responsive<MenuPlacement>;
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
};

/** A menu needs exactly one accessible name. */
export type MenuLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type MenuProps = MenuBaseProps &
  MenuLabelProps &
  Pick<HTMLAttributes<HTMLDivElement>, 'id'> & {
    /**
     * Element that toggles the menu. It must be a single element that accepts a ref. The menu
     * adds its click handler, `aria-haspopup`, `aria-expanded`, and `aria-controls`.
     */
    trigger: ReactElement;
    /** Called when the trigger requests to open the menu. */
    onOpen: () => void;
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
  ButtonRouterLinkProps &
  Omit<ComponentProps<'a'>, keyof MenuItemBaseProps | keyof ButtonRouterLinkProps | 'role'> & {
    href: string;
    /**
     * Link component to render, such as `Link` from `next/link`. It must forward props to its `<a>`.
     * @default 'a'
     */
    as?: ElementType;
  };

export type MenuItemProps = MenuItemButtonProps | MenuItemLinkProps;

export type MenuItemIconProps = Pick<BaseProps, 'className' | 'dataTestId'> & {
  children: ReactNode;
  /**
   * Which side of the label the icon sits on.
   * @default 'start'
   */
  position?: IconPosition;
};

export type MenuDividerProps = Pick<BaseProps, 'className' | 'dataTestId'>;

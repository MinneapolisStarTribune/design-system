'use client';

import type { MouseEvent, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { useListItem, useMergeRefs } from '@floating-ui/react';
import styles from './Menu.module.scss';
import { useMenuContext } from './MenuContext';
import type { MenuItemButtonProps, MenuItemLinkProps, MenuItemProps } from './Menu.types';

type ItemOptions = Pick<MenuItemProps, 'disabled' | 'closeOnSelect' | 'className' | 'dataTestId'>;

/** Registers the item for list navigation and returns its shared props. */
const useMenuItem = ({ disabled, closeOnSelect = true, className, dataTestId }: ItemOptions) => {
  const { activeIndex, getItemProps, closeFromItem } = useMenuContext();
  const { ref, index } = useListItem();

  const itemProps = {
    role: 'menuitem',
    tabIndex: index === activeIndex ? 0 : -1,
    'aria-disabled': disabled || undefined,
    'data-testid': dataTestId,
    className: classNames(
      styles.item,
      'typography-utility-text-regular-medium',
      disabled && styles.itemDisabled,
      className
    ),
  };

  const select = <E extends HTMLElement>(event: MouseEvent<E>, onClick?: MouseEventHandler<E>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
    if (closeOnSelect) closeFromItem();
  };

  return { listItemRef: ref, itemProps, getItemProps, select };
};

const MenuItemLink = ({
  as: LinkComponent = 'a',
  children,
  disabled,
  closeOnSelect,
  dataTestId,
  className,
  ref,
  onClick,
  ...rest
}: MenuItemLinkProps) => {
  const { listItemRef, itemProps, getItemProps, select } = useMenuItem({
    disabled,
    closeOnSelect,
    className,
    dataTestId,
  });
  const mergedRef = useMergeRefs([listItemRef, ref]);

  return (
    <LinkComponent
      {...getItemProps({
        ...rest,
        ...itemProps,
        onClick: (event: MouseEvent<HTMLAnchorElement>) => select(event, onClick),
      })}
      ref={mergedRef}
    >
      {children}
    </LinkComponent>
  );
};

const MenuItemButton = ({
  children,
  disabled,
  closeOnSelect,
  dataTestId,
  className,
  ref,
  onClick,
  ...rest
}: MenuItemButtonProps) => {
  const { listItemRef, itemProps, getItemProps, select } = useMenuItem({
    disabled,
    closeOnSelect,
    className,
    dataTestId,
  });
  const mergedRef = useMergeRefs([listItemRef, ref]);

  return (
    <button
      {...getItemProps({
        ...rest,
        ...itemProps,
        onClick: (event: MouseEvent<HTMLButtonElement>) => select(event, onClick),
      })}
      ref={mergedRef}
      type="button"
    >
      {children}
    </button>
  );
};

/** A menu row. Renders `as` (default `a`) when `href` is set, otherwise a `button`. */
export const MenuItem: React.FC<MenuItemProps> = (props) =>
  props.href !== undefined ? <MenuItemLink {...props} /> : <MenuItemButton {...props} />;

MenuItem.displayName = 'Menu.Item';

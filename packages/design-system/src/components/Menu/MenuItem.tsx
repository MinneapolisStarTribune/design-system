'use client';

import type { MouseEvent, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { useListItem } from '@floating-ui/react';
import styles from './Menu.module.scss';
import { useMenuContext } from './MenuContext';
import type { MenuItemProps } from './Menu.types';

/** A menu row. Renders `as` (default `a`) when `href` is set, otherwise a `button`. */
export const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { getItemProps, closeFromItem } = useMenuContext();
  // Registers the item for arrow key navigation in document order.
  const { ref } = useListItem();
  const { disabled, closeOnSelect = true } = props;

  const itemProps = {
    ref,
    role: 'menuitem',
    tabIndex: -1,
    'aria-disabled': disabled || undefined,
    'data-testid': props.dataTestId,
    className: classNames(
      styles.item,
      'typography-utility-text-regular-medium',
      disabled && styles.itemDisabled,
      props.className
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

  if (props.href !== undefined) {
    const {
      as: LinkComponent = 'a',
      children,
      disabled: _disabled,
      closeOnSelect: _closeOnSelect,
      dataTestId: _dataTestId,
      onClick,
      ...rest
    } = props;

    return (
      <LinkComponent
        {...getItemProps({
          ...rest,
          ...itemProps,
          onClick: (event: MouseEvent<HTMLAnchorElement>) => select(event, onClick),
        })}
      >
        {children}
      </LinkComponent>
    );
  }

  const {
    children,
    disabled: _disabled,
    closeOnSelect: _closeOnSelect,
    dataTestId: _dataTestId,
    onClick,
    ...rest
  } = props;

  return (
    <button
      {...getItemProps({
        ...rest,
        ...itemProps,
        onClick: (event: MouseEvent<HTMLButtonElement>) => select(event, onClick),
      })}
      type="button"
    >
      {children}
    </button>
  );
};

MenuItem.displayName = 'Menu.Item';

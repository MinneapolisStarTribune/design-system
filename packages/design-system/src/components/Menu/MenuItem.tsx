'use client';

import type { MouseEvent, MouseEventHandler } from 'react';
import classNames from 'classnames';
import styles from './Menu.module.scss';
import { useMenuContext } from './MenuContext';
import type { MenuItemProps } from './Menu.types';

/** A menu row. Renders `as` (default `a`) when `href` is set, otherwise a `button`. */
export const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { closeFromItem } = useMenuContext();
  const { disabled, closeOnSelect = true } = props;

  const itemProps = {
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
        {...rest}
        {...itemProps}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => select(event, onClick)}
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
    <button {...rest} {...itemProps} type="button" onClick={(event) => select(event, onClick)}>
      {children}
    </button>
  );
};

MenuItem.displayName = 'Menu.Item';

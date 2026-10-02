'use client';

import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { useMenuContext } from '../MenuContext';
import { MenuItemProps } from '../Menu.types';
import styles from './Menu.module.scss';

export const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { closeFromItem } = useMenuContext();
  const shouldClose = props.closeOnSelect ?? true;

  const itemClassName = classNames(
    styles.item,
    'typography-utility-text-regular-medium',
    props.disabled && styles.itemDisabled,
    props.className
  );

  const handleSelect = (event: MouseEvent<HTMLElement>) => {
    if (props.disabled) {
      event.preventDefault();
      return;
    }
    if (shouldClose) closeFromItem();
  };

  if (props.href !== undefined) {
    const {
      children,
      disabled,
      closeOnSelect: _closeOnSelect,
      onClick,
      dataTestId,
      ...rest
    } = props;

    return (
      <a
        {...rest}
        data-testid={dataTestId}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        className={itemClassName}
        onClick={(event) => {
          if (!disabled) onClick?.(event);
          handleSelect(event);
        }}
      >
        {children}
      </a>
    );
  }

  const { children, disabled, closeOnSelect: _closeOnSelect, onClick, dataTestId, ...rest } = props;

  return (
    <button
      {...rest}
      data-testid={dataTestId}
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      className={itemClassName}
      onClick={(event) => {
        if (!disabled) onClick?.(event);
        handleSelect(event);
      }}
    >
      {children}
    </button>
  );
};

MenuItem.displayName = 'Menu.Item';

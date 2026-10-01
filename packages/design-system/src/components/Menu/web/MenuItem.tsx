'use client';

import { MouseEvent } from 'react';
import classNames from 'classnames';
import { useMenuContext } from '../MenuContext';
import { MenuItemProps } from '../Menu.types';
import styles from './Menu.module.scss';

export const MenuItem = (props: MenuItemProps) => {
  const { close, closeOnSelect: menuCloseOnSelect } = useMenuContext();
  const shouldClose = props.closeOnSelect ?? menuCloseOnSelect;

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
    if (shouldClose) close();
  };

  if (props.href !== undefined) {
    const { children, disabled, closeOnSelect: _closeOnSelect, onClick, ...rest } = props;

    return (
      <a
        {...rest}
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

  const { children, disabled, closeOnSelect: _closeOnSelect, onClick, ...rest } = props;

  return (
    <button
      {...rest}
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

'use client';

import type { MouseEvent } from 'react';
import type { MenuItemProps } from './Menu.types';
import { useMenuItem } from './useMenuItem';

/** A menu row. Renders `as` (default `a`) when `href` is set, otherwise a `button`. */
export const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { itemProps, getItemProps, select } = useMenuItem({
    role: 'menuitem',
    disabled: props.disabled,
    closeOnSelect: props.closeOnSelect ?? true,
    className: props.className,
    dataTestId: props.dataTestId,
  });

  // return link if href is added
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

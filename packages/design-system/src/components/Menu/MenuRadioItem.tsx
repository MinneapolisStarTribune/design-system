'use client';

import type { MouseEvent } from 'react';
import type { MenuRadioItemProps } from './Menu.types';
import { useMenuItem } from './useMenuItem';

/** A menu row that marks the current choice of a single-select set. */
export const MenuRadioItem: React.FC<MenuRadioItemProps> = ({
  checked,
  disabled,
  closeOnSelect = true,
  className,
  dataTestId,
  children,
  onClick,
  ...rest
}) => {
  const { itemProps, getItemProps, select } = useMenuItem({
    role: 'menuitemradio',
    disabled,
    closeOnSelect,
    selected: checked,
    className,
    dataTestId,
  });

  return (
    <button
      {...getItemProps({
        ...rest,
        ...itemProps,
        'aria-checked': checked,
        onClick: (event: MouseEvent<HTMLButtonElement>) => select(event, onClick),
      })}
      type="button"
    >
      {children}
    </button>
  );
};

MenuRadioItem.displayName = 'Menu.RadioItem';

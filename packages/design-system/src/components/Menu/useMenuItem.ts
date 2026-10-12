'use client';

import type { MouseEvent, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { useListItem } from '@floating-ui/react';
import styles from './Menu.module.scss';
import { useMenuContext } from './MenuContext';

type UseMenuItemOptions = {
  role: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
  disabled?: boolean;
  closeOnSelect: boolean;
  /** Marks the current choice with the selected style. */
  selected?: boolean;
  className?: string;
  dataTestId?: string;
};

/** Shared props and selection for menu rows: list registration, roving tabIndex, and closing. */
export const useMenuItem = ({
  role,
  disabled,
  closeOnSelect,
  selected = false,
  className,
  dataTestId,
}: UseMenuItemOptions) => {
  const { activeIndex, getItemProps, closeFromItem } = useMenuContext();
  // Registers the item for arrow key navigation in document order.
  const { ref, index } = useListItem();

  const itemProps = {
    ref,
    role,
    tabIndex: activeIndex === index ? 0 : -1,
    'aria-disabled': disabled || undefined,
    'data-testid': dataTestId,
    className: classNames(
      styles.item,
      selected
        ? [styles.itemSelected, 'typography-utility-text-semibold-medium']
        : 'typography-utility-text-regular-medium',
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

  return { itemProps, getItemProps, select };
};

'use client';

import type { MouseEvent } from 'react';
import classNames from 'classnames';
import { CheckIcon } from '@/icons';
import styles from './Menu.module.scss';
import type { MenuCheckboxItemProps } from './Menu.types';
import { useMenuItem } from './useMenuItem';

/** A menu row with a checkbox, for multi-select menus. Stays open on select by default. */
export const MenuCheckboxItem: React.FC<MenuCheckboxItemProps> = ({
  checked,
  onCheckedChange,
  disabled,
  closeOnSelect = false,
  className,
  dataTestId,
  children,
  onClick,
  ...rest
}) => {
  const { itemProps, getItemProps, select } = useMenuItem({
    role: 'menuitemcheckbox',
    disabled,
    closeOnSelect,
    className,
    dataTestId,
  });

  return (
    <button
      {...getItemProps({
        ...rest,
        ...itemProps,
        'aria-checked': checked,
        onClick: (event: MouseEvent<HTMLButtonElement>) =>
          select(event, (clickEvent) => {
            onClick?.(clickEvent);
            onCheckedChange(!checked);
          }),
      })}
      type="button"
    >
      <span aria-hidden="true" className={classNames(styles.checkbox, checked && styles.checked)}>
        {checked && <CheckIcon size="checkbox-default" className={styles.checkIcon} />}
      </span>
      {children}
    </button>
  );
};

MenuCheckboxItem.displayName = 'Menu.CheckboxItem';

'use client';

import classNames from 'classnames';
import { useListItem } from '@floating-ui/react';
import styles from './Menu.module.scss';
import { useMenuContext } from './MenuContext';
import type { MenuEmptyProps } from './Menu.types';

/**
 * Shown when a menu has no options. A menu must contain items, so this is a disabled menu item
 * that keyboard and screen reader users can still reach.
 */
export const MenuEmpty: React.FC<MenuEmptyProps> = ({
  children = 'No options',
  className,
  dataTestId,
}) => {
  const { activeIndex, getItemProps } = useMenuContext();
  const { ref, index } = useListItem();

  return (
    <div
      {...getItemProps({
        ref,
        role: 'menuitem',
        'aria-disabled': true,
        tabIndex: activeIndex === index ? 0 : -1,
        className: classNames(styles.empty, 'typography-utility-text-regular-medium', className),
      })}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

MenuEmpty.displayName = 'Menu.Empty';

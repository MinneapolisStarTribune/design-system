import React from 'react';
import classNames from 'classnames';
import { MenuItemIconProps } from '../Menu.types';
import styles from './Menu.module.scss';

export const MenuItemIcon: React.FC<MenuItemIconProps> = ({
  children,
  position = 'start',
  className,
  dataTestId,
}) => (
  <span
    aria-hidden="true"
    data-testid={dataTestId}
    className={classNames(styles.icon, position === 'end' && styles.iconEnd, className)}
  >
    {children}
  </span>
);

MenuItemIcon.displayName = 'Menu.ItemIcon';

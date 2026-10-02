import React from 'react';
import classNames from 'classnames';
import { MenuDividerProps } from '../Menu.types';
import styles from './Menu.module.scss';

export const MenuDivider: React.FC<MenuDividerProps> = ({ className, dataTestId }) => (
  <div
    role="separator"
    data-testid={dataTestId}
    className={classNames(styles.divider, className)}
  />
);

MenuDivider.displayName = 'Menu.Divider';

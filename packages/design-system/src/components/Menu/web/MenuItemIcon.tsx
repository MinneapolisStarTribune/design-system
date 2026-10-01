import classNames from 'classnames';
import { MenuItemIconProps } from '../Menu.types';
import styles from './Menu.module.scss';

export const MenuItemIcon = ({ children, position = 'start', className }: MenuItemIconProps) => (
  <span
    aria-hidden="true"
    className={classNames(styles.icon, position === 'end' && styles.iconEnd, className)}
  >
    {children}
  </span>
);

import classNames from 'classnames';
import styles from './Menu.module.scss';
import type { MenuItemIconProps } from './Menu.types';

/** Decorative icon inside a `Menu.Item`, hidden from screen readers. */
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

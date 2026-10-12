import classNames from 'classnames';
import styles from './Menu.module.scss';
import type { MenuItemCountProps } from './Menu.types';

/** Result count at the end of a row, such as `(112)` on a filter option. */
export const MenuItemCount: React.FC<MenuItemCountProps> = ({
  children,
  className,
  dataTestId,
}) => (
  <span
    data-testid={dataTestId}
    className={classNames(styles.count, 'typography-utility-text-regular-small', className)}
  >
    {children}
  </span>
);

MenuItemCount.displayName = 'Menu.ItemCount';

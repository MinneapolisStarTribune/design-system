import classNames from 'classnames';
import styles from './Menu.module.scss';
import type { MenuDividerProps } from './Menu.types';

/** Separator between groups of items. Overlaps the row above, so it adds no height. */
export const MenuDivider: React.FC<MenuDividerProps> = ({ className, dataTestId }) => (
  <div
    role="separator"
    data-testid={dataTestId}
    className={classNames(styles.divider, className)}
  />
);

MenuDivider.displayName = 'Menu.Divider';

import classNames from 'classnames';
import { MenuDividerProps } from '../Menu.types';
import styles from './Menu.module.scss';

export const MenuDivider = ({ className }: MenuDividerProps) => (
  <div role="separator" className={classNames(styles.divider, className)} />
);

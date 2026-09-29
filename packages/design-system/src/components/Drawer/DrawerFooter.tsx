'use client';

import classNames from 'classnames';
import styles from './Drawer.module.scss';
import type { DrawerSectionProps } from './Drawer.types';

/** Action row pinned below the body. */
export const DrawerFooter: React.FC<DrawerSectionProps> = ({ children, className, dataTestId }) => {
  return (
    <div className={classNames(styles.footer, className)} data-testid={dataTestId}>
      {children}
    </div>
  );
};

DrawerFooter.displayName = 'DrawerFooter';

'use client';

import classNames from 'classnames';
import styles from './Drawer.module.scss';
import type { DrawerSectionProps } from './Drawer.types';

/** Main content region; the only part of the panel that scrolls. */
export const DrawerBody: React.FC<DrawerSectionProps> = ({ children, className, dataTestId }) => {
  return (
    <div
      className={classNames('typography-utility-text-regular-small', styles.body, className)}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

DrawerBody.displayName = 'DrawerBody';

'use client';

import { useId } from 'react';
import classNames from 'classnames';
import styles from './Menu.module.scss';
import type { MenuGroupProps } from './Menu.types';

/** A titled set of items. The title names the group for screen readers. */
export const MenuGroup: React.FC<MenuGroupProps> = ({ label, children, className, dataTestId }) => {
  const labelId = useId();

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      data-testid={dataTestId}
      className={classNames(className)}
    >
      <div id={labelId} className={classNames(styles.groupLabel, 'typography-utility-section-h6')}>
        {label}
      </div>
      {children}
    </div>
  );
};

MenuGroup.displayName = 'Menu.Group';

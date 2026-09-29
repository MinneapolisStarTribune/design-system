'use client';

import { useEffect } from 'react';
import classNames from 'classnames';
import styles from './Drawer.module.scss';
import { useDrawerContext } from './DrawerContext';
import type { DrawerSectionProps } from './Drawer.types';

/** Supporting line under the heading, wired to `aria-describedby`. */
export const DrawerDescription: React.FC<DrawerSectionProps> = ({
  children,
  className,
  dataTestId,
}) => {
  const { descriptionId, setHasDescription } = useDrawerContext();

  useEffect(() => {
    setHasDescription(true);

    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      id={descriptionId}
      className={classNames('typography-utility-text-regular-small', styles.description, className)}
      data-testid={dataTestId}
    >
      {children}
    </p>
  );
};

DrawerDescription.displayName = 'DrawerDescription';

'use client';

import { useEffect } from 'react';
import classNames from 'classnames';
import styles from './Drawer.module.scss';
import { useDrawerContext } from './DrawerContext';
import type { DrawerSectionProps } from './Drawer.types';

/** Drawer title. Renders an `h2` and names the drawer via `aria-labelledby`. */
export const DrawerHeading: React.FC<DrawerSectionProps> = ({
  children,
  className,
  dataTestId,
}) => {
  const { headingId, setHasHeading } = useDrawerContext();

  useEffect(() => {
    setHasHeading(true);

    return () => setHasHeading(false);
  }, [setHasHeading]);

  return (
    <h2
      id={headingId}
      className={classNames('typography-utility-section-h3', styles.heading, className)}
      data-testid={dataTestId}
    >
      {children}
    </h2>
  );
};

DrawerHeading.displayName = 'DrawerHeading';

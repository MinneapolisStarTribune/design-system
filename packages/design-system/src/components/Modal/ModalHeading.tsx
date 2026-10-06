'use client';

import { useEffect } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.scss';
import { useModalContext } from './ModalContext';
import type { ModalHeadingBaseProps } from './Modal.types';

/** Title. Renders an `h2` by default and names the panel via `aria-labelledby`. */
export const ModalHeading: React.FC<ModalHeadingBaseProps> = ({
  as: Component = 'h2',
  children,
  className,
  dataTestId,
  componentName,
}) => {
  const { headingId, setHasHeading } = useModalContext(componentName);

  useEffect(() => {
    setHasHeading(true);

    return () => setHasHeading(false);
  }, [setHasHeading]);

  return (
    <Component
      id={headingId}
      className={classNames('typography-utility-section-h3', styles.heading, className)}
      data-testid={dataTestId}
    >
      {children}
    </Component>
  );
};

ModalHeading.displayName = 'ModalHeading';

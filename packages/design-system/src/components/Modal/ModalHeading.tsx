'use client';

import { useEffect } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.scss';
import { useModalContext } from './ModalContext';
import type { ModalSectionBaseProps } from './Modal.types';

/** Title. Renders an `h2` and names the panel via `aria-labelledby`. */
export const ModalHeading: React.FC<ModalSectionBaseProps> = ({
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
    <h2
      id={headingId}
      className={classNames('typography-utility-section-h3', styles.heading, className)}
      data-testid={dataTestId}
    >
      {children}
    </h2>
  );
};

ModalHeading.displayName = 'ModalHeading';

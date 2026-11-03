'use client';

import { useEffect } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.scss';
import { useModalContext } from './ModalContext';
import type { ModalSectionBaseProps } from './Modal.types';

/** Main content region; the only part of the panel that scrolls. */
export const ModalBody: React.FC<ModalSectionBaseProps> = ({
  children,
  className,
  dataTestId,
  componentName,
}) => {
  const { bodyId, setHasBody } = useModalContext(componentName);

  useEffect(() => {
    setHasBody(true);

    return () => setHasBody(false);
  }, [setHasBody]);

  return (
    <div
      id={bodyId}
      className={classNames('typography-utility-text-regular-small', styles.body, className)}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

ModalBody.displayName = 'ModalBody';

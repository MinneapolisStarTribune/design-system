'use client';

import classNames from 'classnames';
import styles from './Modal.module.scss';
import { useModalContext } from './ModalContext';
import type { ModalSectionBaseProps } from './Modal.types';

/** Action row pinned below the body. */
export const ModalFooter: React.FC<ModalSectionBaseProps> = ({
  children,
  className,
  dataTestId,
  componentName,
}) => {
  useModalContext(componentName);

  return (
    <div className={classNames(styles.footer, className)} data-testid={dataTestId}>
      {children}
    </div>
  );
};

ModalFooter.displayName = 'ModalFooter';

import React from 'react';
import classNames from 'classnames';
import { CloseIcon } from '@/icons';
import styles from './CandyBar.module.scss';

export type CandyBarProps = {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
};

export const CandyBar: React.FC<CandyBarProps> = ({ children, onClose, className }) => {
  return (
    <div className={classNames(styles.candyBar, className)}>
      <div className={styles.content}>{children}</div>
      <button
        type="button"
        aria-label="Dismiss candy bar"
        className={styles.closeButton}
        onClick={onClose}
      >
        <CloseIcon size="large" color="on-dark-primary" />
      </button>
    </div>
  );
};

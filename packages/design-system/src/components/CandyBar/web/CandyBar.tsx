import React from 'react';
import classNames from 'classnames';
import { CloseIcon } from '@/icons';
import styles from './CandyBar.module.scss';

export type CandyBarProps = {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
};

export const CandyBar: React.FC<CandyBarProps> = ({ children, onClose, className, style }) => {
  return (
    <div className={classNames(styles.candyBar, className)} style={style}>
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

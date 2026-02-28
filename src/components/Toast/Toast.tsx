import React from 'react';
import classNames from 'classnames';

import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/iconNames';
import styles from './Toast.module.scss';

export const TOAST_VARIANTS = ['info', 'success', 'warning', 'error'] as const;
export type ToastVariant = (typeof TOAST_VARIANTS)[number];

export type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  showIcon?: boolean;
  onClose: () => void;
  dataTestId?: string;
};

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  info: 'information-filled',
  success: 'check',
  warning: 'information-filled',
  error: 'error-filled',
};

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = 'info',
  showIcon = true,
  onClose,
  dataTestId,
}) => {
  const iconName = VARIANT_ICON[variant];
  const isError = variant === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={classNames(styles.toast, styles[`variant-${variant}`])}
      data-testid={dataTestId}
    >
      <div className={styles.content}>
        {showIcon === true && (
          <span className={styles.icon} aria-hidden>
            <Icon name={iconName} size="small" />
          </span>
        )}
        <div className={styles.text}>
          <span className={styles.title}>{title}</span>
          {description && <span className={styles.description}>{description}</span>}
        </div>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        className={styles.closeButton}
        onClick={onClose}
      >
        <Icon name="close" size="small" />
      </button>
    </div>
  );
};

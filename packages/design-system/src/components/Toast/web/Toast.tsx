'use client';

import classNames from 'classnames';
import { CloseIcon, ErrorIcon, InformationIcon, SuccessIcon, WarningIcon } from '@/icons';
import { TOAST_VARIANTS, type ToastProps, type ToastVariant } from '@/components/Toast/Toast.types';
import styles from './Toast.module.scss';

export { TOAST_VARIANTS, type ToastProps, type ToastVariant };

const VARIANT_ICON = {
  info: InformationIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
} as const;

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = 'info',
  showIcon = true,
  showCloseButton = true,
  exiting = false,
  onClose,
  dataTestId,
}) => {
  const VariantIcon = VARIANT_ICON[variant];
  const isError = variant === 'error';
  const liveRegionRole = isError ? 'alert' : 'status';
  const ariaLive = isError ? 'assertive' : 'polite';

  return (
    <div
      role={liveRegionRole}
      aria-live={ariaLive}
      aria-atomic="true"
      className={classNames(
        styles.toast,
        styles[`variant-${variant}`],
        exiting && styles.toastExiting
      )}
      data-testid={dataTestId}
    >
      <div className={styles.content}>
        {showIcon === true && (
          <span className={styles.icon} aria-hidden>
            <VariantIcon style={{ color: 'inherit' }} />
          </span>
        )}
        <div className={styles.text}>
          <span className={classNames(styles.title, 'typography-utility-label-semibold-large')}>
            {title}
          </span>
          {description && (
            <span
              className={classNames(styles.description, 'typography-utility-text-regular-small')}
            >
              {description}
            </span>
          )}
        </div>
      </div>
      {showCloseButton ? (
        <button
          type="button"
          aria-label="Dismiss notification"
          className={styles.closeButton}
          onClick={onClose}
        >
          <CloseIcon style={{ color: 'inherit' }} />
        </button>
      ) : null}
    </div>
  );
};

import classNames from 'classnames';
import { useAnalytics } from '@/hooks/useAnalytics';
import { CloseIcon, ErrorIcon, InformationIcon, SuccessIcon, WarningIcon } from '@/icons';
import styles from './Toast.module.scss';

export const TOAST_VARIANTS = ['info', 'success', 'warning', 'error'] as const;
export type ToastVariant = (typeof TOAST_VARIANTS)[number];

export type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  showIcon?: boolean;
  exiting?: boolean;
  onClose: () => void;
  /** Per-toast tracking data merged into the dismiss event. Use to distinguish toasts (e.g. notification_type, module_name). */
  analytics?: Record<string, unknown>;
  dataTestId?: string;
};

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
  exiting = false,
  onClose,
  analytics: analyticsOverride,
  dataTestId,
}) => {
  const { track } = useAnalytics();
  const VariantIcon = VARIANT_ICON[variant];

  const handleClose = () => {
    track({
      event: 'toast_dismiss',
      component: 'Toast',
      title,
      variant,
      ...analyticsOverride,
    });
    onClose();
  };
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
            <VariantIcon />
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
      <button
        type="button"
        aria-label="Dismiss notification"
        className={styles.closeButton}
        onClick={handleClose}
      >
        <CloseIcon />
      </button>
    </div>
  );
};

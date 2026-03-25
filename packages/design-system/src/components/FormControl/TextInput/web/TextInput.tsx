import React from 'react';
import classNames from 'classnames';
import { useAnalytics } from '@/hooks/useAnalytics';
import { FormControlProps } from '@/components/FormControl/FormControl';
import { AccessibilityProps } from '@/types/globalTypes';
import { SuccessIcon } from '@/icons';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import styles from './TextInput.module.scss';

export type TextInputSize = NonNullable<FormControlProps['size']>;

/** Placeholder typography by size (italic); value text uses regular when filled */
const PLACEHOLDER_TYPOGRAPHY: Record<TextInputSize, string> = {
  small: 'typography-utility-text-italic-small',
  medium: 'typography-utility-text-italic-medium',
  large: 'typography-utility-text-italic-large',
};

export interface TextInputProps
  extends FormControlProps,
    AccessibilityProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      | 'size'
      | 'disabled'
      | 'className'
      | 'aria-label'
      | 'aria-labelledby'
      | 'aria-describedby'
      | 'aria-invalid'
      | 'aria-hidden'
    > {
  size?: TextInputSize;
  placeholderText?: string;
  /** Optional decorative icon element (e.g. <SearchIcon />). */
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  rounded?: boolean;
  isDisabled?: boolean;
  /** When true, shows error border. Parent/FormGroup manages validation state. */
  isError?: boolean;
  /** When true, shows success border. Parent/FormGroup manages validation state. */
  isSuccess?: boolean;
  /** Override label association (e.g. when used outside FormGroup) */
  'aria-labelledby'?: string;
  /** Override invalid state for screen readers */
  'aria-invalid'?: boolean;
  /** Per-input tracking data merged into the blur event. Use to distinguish inputs (e.g. form_field, module_name). */
  analytics?: Record<string, unknown>;
}

export const TextInput: React.FC<TextInputProps> = ({
  size = 'medium',
  placeholderText,
  icon,
  iconPosition = 'end',
  rounded = false,
  isDisabled = false,
  isError = false,
  isSuccess = false,
  className,
  dataTestId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedByProp,
  'aria-labelledby': ariaLabelledByProp,
  'aria-invalid': ariaInvalidProp,
  id: idProp,
  value,
  onChange,
  onBlur,
  analytics: analyticsOverride,
  ...props
}) => {
  const { track } = useAnalytics();
  const formGroupContext = useFormGroupContext();

  // Error state: use prop when provided, else fall back to FormGroup context (caption variant error)
  const hasError = isError ?? formGroupContext?.hasError ?? false;
  const hasSuccess = isSuccess ?? formGroupContext?.hasSuccess ?? false;

  // Accessibility: Connect form control to label, description, and caption via ARIA attributes
  const ariaLabelledBy = ariaLabelledByProp ?? formGroupContext?.labelId;
  const inputId = idProp ?? formGroupContext?.inputId;

  const describedBy = formGroupContext
    ? [formGroupContext.descriptionId, formGroupContext.captionId].filter(Boolean).join(' ') ||
      undefined
    : undefined;
  const ariaDescribedBy = ariaDescribedByProp ?? describedBy;

  // aria-invalid: set when error is present for screen reader announcement
  const ariaInvalid = ariaInvalidProp ?? (hasError ? true : undefined);

  const isFilled = value != null && String(value).trim().length > 0;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    track({
      event: 'text_input_blur',
      component: 'TextInput',
      value_length: value != null ? String(value).length : 0,
      ...analyticsOverride,
    });
    onBlur?.(e);
  };

  // Icon is always decorative when provided via the simple icon prop
  const iconElement = icon ?? null;

  const leftIcon = icon && iconPosition === 'start' ? iconElement : undefined;
  const rightIcon = icon && iconPosition === 'end' ? iconElement : undefined;

  // Validated/success state shows checkmark icon at end (per design spec)
  const successCheckmark = hasSuccess && !hasError ? <SuccessIcon aria-hidden /> : null;

  const wrapperClasses = classNames(
    styles.wrapper,
    styles[size],
    {
      [styles.rounded]: rounded,
      [styles.disabled]: isDisabled,
      [styles.error]: hasError,
      [styles.success]: hasSuccess,
      [styles.filled]: isFilled,
    },
    className
  );

  return (
    <div className={wrapperClasses}>
      {leftIcon && <span className={styles.iconStart}>{leftIcon}</span>}
      <input
        type="text"
        id={inputId}
        className={classNames(styles.input, PLACEHOLDER_TYPOGRAPHY[size], styles.valueTypography)}
        placeholder={placeholderText}
        disabled={isDisabled}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        data-testid={dataTestId}
        {...props}
      />
      {rightIcon && <span className={styles.iconEnd}>{rightIcon}</span>}
      {successCheckmark}
    </div>
  );
};

'use client';

import React from 'react';
import classNames from 'classnames';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import fieldStyles from '@/components/FormControl/FieldSurface.module.scss';
import styles from './TextArea.module.scss';
import type { BaseTextAreaProps } from '../TextArea.types';
import { type AccessibilityProps } from '@/types';

/** Native textarea attributes TextArea passes through. Add here (and to the JSX below) to support more. */
type NativeTextAreaProps = Pick<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'id'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'rows'
  | 'maxLength'
  | 'minLength'
  | 'required'
  | 'readOnly'
  | 'autoComplete'
  | 'autoFocus'
  | 'spellCheck'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
>;

export interface TextAreaProps
  extends BaseTextAreaProps,
    // aria-hidden is left out: hiding a focusable field from assistive tech is never valid
    Omit<AccessibilityProps, 'aria-hidden'>,
    NativeTextAreaProps {
  /** Override label association (e.g. when used outside FormGroup) */
  'aria-labelledby'?: string;
  /** Override invalid state for screen readers */
  'aria-invalid'?: boolean;
  /** When true, users can drag the corner to change the height. Defaults to true. */
  resizable?: boolean;
  /** Forwarded to the native textarea (React 19 passes ref as a regular prop) */
  ref?: React.Ref<HTMLTextAreaElement>;
}

export const TextArea: React.FC<TextAreaProps> = ({
  placeholderText,
  resizable = true,
  rows = 2,
  isDisabled = false,
  isError,
  isSuccess,
  className,
  style,
  dataTestId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedByProp,
  'aria-labelledby': ariaLabelledByProp,
  'aria-invalid': ariaInvalidProp,
  id: idProp,
  name,
  value,
  defaultValue,
  maxLength,
  minLength,
  required,
  readOnly,
  autoComplete,
  autoFocus,
  spellCheck,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  analytics: analyticsOverride,
  ref,
}) => {
  const { track } = useAnalytics();
  const formGroupContext = useFormGroupContext();

  // Error/success state: use prop when provided, else fall back to FormGroup context (caption variant)
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

  const ariaInvalid = ariaInvalidProp ?? (hasError ? true : undefined);

  const isFilled = value != null && String(value).trim().length > 0;

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    track({
      event: 'text_area_blur',
      component: 'TextArea',
      value_length: value != null ? String(value).length : 0,
      ...analyticsOverride,
    });
    onBlur?.(e);
  };

  return (
    <textarea
      ref={ref}
      id={inputId}
      name={name}
      rows={rows}
      className={classNames(
        fieldStyles.surface,
        fieldStyles.control,
        styles.textarea,
        'typography-utility-text-italic-medium',
        {
          [styles.resizable]: resizable,
          [fieldStyles.disabled]: isDisabled,
          [fieldStyles.error]: hasError,
          [fieldStyles.success]: hasSuccess,
          [fieldStyles.filled]: isFilled,
        },
        className
      )}
      style={style}
      placeholder={placeholderText}
      disabled={isDisabled}
      value={value}
      defaultValue={defaultValue}
      maxLength={maxLength}
      minLength={minLength}
      required={required}
      readOnly={readOnly}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      spellCheck={spellCheck}
      onChange={onChange}
      onBlur={handleBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      data-testid={dataTestId}
    />
  );
};

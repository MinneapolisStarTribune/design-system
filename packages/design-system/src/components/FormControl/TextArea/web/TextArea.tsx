'use client';

import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import fieldStyles from '@/components/FormControl/FieldSurface.module.scss';
import styles from './TextArea.module.scss';
import type { BaseTextAreaProps } from '../TextArea.types';
import { type AccessibilityProps } from '@/types';

type NativeTextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'disabled'
  | 'className'
  | 'placeholder'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-hidden'
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
  value,
  defaultValue,
  onChange,
  onBlur,
  analytics: analyticsOverride,
  ref,
  ...props
}) => {
  const { track } = useAnalytics();
  const formGroupContext = useFormGroupContext();

  // Error/success state: use prop when provided, else fall back to FormGroup context (caption variant)
  const hasError = isError ?? formGroupContext?.hasError ?? false;
  const hasSuccess = isSuccess ?? formGroupContext?.hasSuccess ?? false;

  // Accessibility: Connect form control to label, description, and caption via ARIA attributes
  const ariaLabelledBy = ariaLabelledByProp ?? formGroupContext?.labelId;
  const inputId = idProp ?? formGroupContext?.inputId;

  // Keep the caller's ids alongside FormGroup's so the caption stays linked
  const ariaDescribedBy =
    [ariaDescribedByProp, formGroupContext?.descriptionId, formGroupContext?.captionId]
      .filter(Boolean)
      .join(' ') || undefined;

  const ariaInvalid = ariaInvalidProp ?? (hasError ? true : undefined);

  // Uncontrolled textareas track their own text so the filled border still applies
  const [uncontrolledText, setUncontrolledText] = useState(() => String(defaultValue ?? ''));
  const isFilled = String(value ?? uncontrolledText).trim().length > 0;

  // Sync with text the browser restored before hydration (back/forward, autofill), then forward the ref
  const textAreaRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (el) setUncontrolledText(el.value);
      if (typeof ref === 'function') return ref(el);
      if (ref) ref.current = el;
    },
    [ref]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value == null) setUncontrolledText(e.target.value);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    track({
      event: 'text_area_blur',
      component: 'TextArea',
      value_length: e.currentTarget.value.length,
      ...analyticsOverride,
    });
    onBlur?.(e);
  };

  return (
    <textarea
      ref={textAreaRef}
      id={inputId}
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
      onChange={handleChange}
      onBlur={handleBlur}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      data-testid={dataTestId}
      {...props}
    />
  );
};

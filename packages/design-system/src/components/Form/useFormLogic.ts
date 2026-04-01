'use client';

import React, { useCallback, useState } from 'react';

/**
 * Validation result: keys are field names, values are error messages (undefined = no error).
 * Return this from a validate function to report field-level errors.
 */
export type FormValidationErrors<T extends Record<string, unknown>> = Partial<
  Record<keyof T, string>
>;

/**
 * Options for useFormLogic. Use this hook **in conjunction with** the Form component when you
 * want out-of-the-box form state and validation. The hook is optional — use your own state/logic
 * if you prefer.
 */
export interface UseFormLogicOptions<T extends Record<string, unknown>> {
  /** Initial field values (keyed by field name). */
  initialValues: T;
  /** Called when form is submitted and validation passes (if validate is provided). */
  onSubmit: (values: T) => void | Promise<void>;
  /**
   * Optional. Run on submit (and optionally on blur). Return an object of field names to error
   * messages; omit a field or set to undefined for no error. Consuming app owns validation logic.
   */
  validate?: (values: T) => FormValidationErrors<T>;
  /** Run validate on form submit. No-op if validate is not provided. @default true */
  validateOnSubmit?: boolean;
  /** Run validate when a field blurs and set that field's error. @default false */
  validateOnBlur?: boolean;
}

export interface UseFormLogicReturn<T extends Record<string, unknown>> {
  /** Current field values. */
  values: T;
  /** Current field errors (set by validate or setFieldError). */
  errors: FormValidationErrors<T>;
  /** Set a single field value. */
  setFieldValue: (field: keyof T, value: unknown) => void;
  /** Set a single field error (e.g. from your own validation). */
  setFieldError: (field: keyof T, message: string | undefined) => void;
  /** Update a field value by name. Alias for setFieldValue. */
  handleChange: (field: keyof T, value: unknown) => void;
  /** Use with onChange={handleChangeEvent}; uses e.target.name and e.target.value. */
  handleChangeEvent: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  /** Call when a field blurs; runs validate for that field only if validateOnBlur is true. */
  handleBlur: (field: keyof T) => void;
  /**
   * Run submit logic (validate, then onSubmit if valid). Accepts optional form event for web
   * (<Form onSubmit={handleSubmit}>); call with no args on React Native (e.g. onPress={handleSubmitPress}).
   */
  handleSubmit: (e?: React.FormEvent) => void;
  /** No-arg submit handler for React Native: use onPress={handleSubmitPress}. Same logic as handleSubmit. */
  handleSubmitPress: () => void;
}

/**
 * **Optional** hook for form state and validation. Use **in conjunction with** the Form component
 * when you want out-of-the-box logic without building it yourself.
 *
 * Presentation and UI stay separate: Form handles layout and the semantic <form>; this hook
 * handles values, errors, and submit flow. You can skip the hook and wire Form to your own state
 * and validation, or use the hook for a ready-made option.
 *
 * Validation is optional and provided by the app via the validate option.
 */
export function useFormLogic<T extends Record<string, unknown>>(
  options: UseFormLogicOptions<T>
): UseFormLogicReturn<T> {
  const {
    initialValues,
    onSubmit,
    validate,
    validateOnSubmit = true,
    validateOnBlur = false,
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormValidationErrors<T>>({});

  const setFieldValue = useCallback((field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setFieldError = useCallback((field: keyof T, message: string | undefined) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message === undefined) delete next[field];
      else next[field] = message;
      return next;
    });
  }, []);

  const handleChange = setFieldValue;

  const handleChangeEvent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFieldValue(e.target.name as keyof T, e.target.value);
    },
    [setFieldValue]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      if (validateOnBlur && validate) {
        const fieldErrors = validate(values) ?? {};
        setFieldError(field, fieldErrors[field]);
      }
    },
    [validateOnBlur, validate, values, setFieldError]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault?.();
      if (validateOnSubmit && validate) {
        const nextErrors = validate(values) ?? {};
        setErrors(nextErrors);
        if (Object.values(nextErrors).some(Boolean)) return;
      }
      onSubmit(values);
    },
    [validateOnSubmit, validate, values, onSubmit]
  );

  const handleSubmitPress = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return {
    values,
    errors,
    setFieldValue,
    setFieldError,
    handleChange,
    handleChangeEvent,
    handleBlur,
    handleSubmit,
    handleSubmitPress,
  };
}

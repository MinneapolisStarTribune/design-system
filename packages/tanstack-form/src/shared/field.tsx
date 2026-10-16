'use client';

import React from 'react';
import { FormGroup } from '@minneapolisstartribune/design-system/web';
import { type AnyFieldApi, type AnyFieldMeta, useSelector } from '@tanstack/react-form';

/**
 * A `form.Field` field holding `TValue`. `TChange` is what the adapter writes back, so an adapter
 * can read a wider type than it writes (e.g. read `string | null`, write `string`).
 */
export type BoundField<TValue, TChange = TValue> = Pick<
  AnyFieldApi,
  'name' | 'form' | 'handleBlur'
> & {
  state: { value: TValue; meta: AnyFieldMeta };
  handleChange: (value: TChange) => void;
};

/** Label/description/caption props shared by adapters that render their own FormGroup label. */
export interface FieldLabelProps {
  /** Renders `FormGroup.Label`, associated with the control. */
  label?: React.ReactNode;
  /** Renders `FormGroup.Description` below the label. */
  description?: React.ReactNode;
  /** Info caption below the control. Replaced by the validation error when one is visible. */
  caption?: React.ReactNode;
  /** Shows the "(Optional)" marker next to the label. */
  optional?: boolean;
}

/** Validation errors can be issues (`{ message }`) or plain strings depending on the validator. */
const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return undefined;
};

/**
 * First of `field.state.meta.errors`, once the field has been blurred or the form has been
 * submitted. `undefined` otherwise.
 */
export const useFieldError = (
  field: Pick<BoundField<unknown, never>, 'form' | 'state'>
): string | undefined => {
  const submissionAttempts = useSelector(field.form.store, (state) => state.submissionAttempts);
  const showErrors = field.state.meta.isBlurred || submissionAttempts > 0;
  return showErrors ? field.state.meta.errors.map(getErrorMessage).find(Boolean) : undefined;
};

interface FieldGroupProps extends FieldLabelProps {
  errorMessage: string | undefined;
  /** The control's id when the caller sets one, so the label still points at it. */
  htmlFor?: string;
  children: React.ReactNode;
}

/** FormGroup with the label, description and info/error caption every adapter renders. */
export const FieldGroup = ({
  label,
  description,
  caption,
  optional,
  errorMessage,
  htmlFor,
  children,
}: FieldGroupProps) => (
  <FormGroup>
    {label != null && (
      <FormGroup.Label htmlFor={htmlFor} optional={optional}>
        {label}
      </FormGroup.Label>
    )}
    {description != null && <FormGroup.Description>{description}</FormGroup.Description>}
    {children}
    {errorMessage !== undefined ? (
      <FormGroup.Caption variant="error">{errorMessage}</FormGroup.Caption>
    ) : (
      caption != null && <FormGroup.Caption variant="info">{caption}</FormGroup.Caption>
    )}
  </FormGroup>
);

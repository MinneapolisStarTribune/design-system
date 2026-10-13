'use client';

import React from 'react';
import {
  FormGroup,
  TextInput,
  type TextInputProps,
} from '@minneapolisstartribune/design-system/web';
import { type FieldWithValue } from '@tanstack/react-form';

export interface TextFieldProps
  extends Omit<TextInputProps, 'value' | 'name' | 'isError' | 'aria-invalid'> {
  /** The field from `form.Field`'s render prop. Must be a string field. */
  field: FieldWithValue<string>;
  /** Renders a FormGroup.Label wired to the input. */
  label?: React.ReactNode;
  /** Renders a FormGroup.Description below the label. */
  description?: React.ReactNode;
  /** Info caption shown below the input. Replaced by the validation error when one is visible. */
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
 * Design-system TextInput bound to a TanStack Form field: `<TextField field={field} />`.
 *
 * Errors come from `field.errors`, which already respects the form's `errorVisibility`
 * policy — this component does not add its own "touched" logic.
 */
export const TextField = ({
  field,
  label,
  description,
  caption,
  optional,
  onChange,
  onBlur,
  ...inputProps
}: TextFieldProps) => {
  const errorMessage = field.errors.map(getErrorMessage).find(Boolean);
  const hasError = errorMessage !== undefined;

  return (
    <FormGroup>
      {label != null && <FormGroup.Label optional={optional}>{label}</FormGroup.Label>}
      {description != null && <FormGroup.Description>{description}</FormGroup.Description>}
      <TextInput
        {...inputProps}
        name={field.name}
        value={field.value}
        isError={hasError}
        onChange={(event) => {
          field.handleChange(event.target.value);
          onChange?.(event);
        }}
        onBlur={(event) => {
          field.handleBlur();
          onBlur?.(event);
        }}
      />
      {hasError ? (
        <FormGroup.Caption variant="error">{errorMessage}</FormGroup.Caption>
      ) : (
        caption != null && <FormGroup.Caption variant="info">{caption}</FormGroup.Caption>
      )}
    </FormGroup>
  );
};

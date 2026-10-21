'use client';

import { TextArea, type TextAreaProps } from '@minneapolisstartribune/design-system/web';
import { type BoundField, FieldGroup, type FieldLabelProps, useFieldError } from '../shared/field';

export interface TextAreaFieldProps
  extends Omit<TextAreaProps, 'value' | 'defaultValue' | 'name' | 'isError' | 'aria-invalid'>,
    FieldLabelProps {
  /** The field from `form.Field`'s render prop. Must be a string field. */
  field: BoundField<string>;
}

/**
 * Design-system TextArea bound to a TanStack Form field: `<TextAreaField field={field} />`.
 *
 * Shows the first of `field.state.meta.errors` once the field has been blurred or the form
 * has been submitted.
 */
export const TextAreaField = ({
  field,
  label,
  description,
  caption,
  optional,
  onChange,
  onBlur,
  ...textAreaProps
}: TextAreaFieldProps) => {
  const errorMessage = useFieldError(field);

  return (
    <FieldGroup
      label={label}
      description={description}
      caption={caption}
      optional={optional}
      errorMessage={errorMessage}
      htmlFor={textAreaProps.id}
    >
      <TextArea
        {...textAreaProps}
        name={field.name}
        value={field.state.value}
        isError={errorMessage !== undefined}
        onChange={(event) => {
          field.handleChange(event.target.value);
          onChange?.(event);
        }}
        onBlur={(event) => {
          field.handleBlur();
          onBlur?.(event);
        }}
      />
    </FieldGroup>
  );
};

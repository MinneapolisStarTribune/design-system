'use client';

import {
  FormControlDatepicker,
  type FormControlDatepickerProps,
} from '@minneapolisstartribune/design-system/web';
import { type BoundField, FieldGroup, type FieldLabelProps, useFieldError } from '../shared/field';

export interface DateFieldProps
  extends Omit<
      FormControlDatepickerProps,
      'name' | 'value' | 'defaultValue' | 'isError' | 'aria-invalid'
    >,
    FieldLabelProps {
  field: BoundField<string | null, string>;
}

/** Use validateDateInput with the same required/min/max options in field validators. */
export const DateField = ({
  field,
  label,
  description,
  caption,
  optional,
  onChange,
  onTouched,
  ...props
}: DateFieldProps) => {
  const errorMessage = useFieldError(field);
  return (
    <FieldGroup
      label={label}
      description={description}
      caption={caption}
      optional={optional}
      errorMessage={errorMessage}
      htmlFor={props.id}
    >
      <FormControlDatepicker
        {...props}
        name={field.name}
        value={field.state.value}
        isError={errorMessage !== undefined}
        onChange={(next) => {
          field.handleChange(next);
          onChange?.(next);
        }}
        onTouched={() => {
          field.handleBlur();
          onTouched?.();
        }}
      />
    </FieldGroup>
  );
};

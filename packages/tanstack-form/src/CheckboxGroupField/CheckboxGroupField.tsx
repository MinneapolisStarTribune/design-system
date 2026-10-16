'use client';

import { CheckboxGroup, type CheckboxGroupProps } from '@minneapolisstartribune/design-system/web';
import {
  type BoundField,
  describedBy,
  type DistributiveOmit,
  FieldGroup,
  type FieldLabelProps,
  FocusBoundary,
  useFieldError,
  useFieldGroupIds,
} from '../shared/field';

export type CheckboxGroupFieldProps = DistributiveOmit<
  CheckboxGroupProps,
  'value' | 'onChange' | 'error'
> &
  FieldLabelProps & {
    /** The field from `form.Field`'s render prop. Must be a `string[]` field. */
    field: BoundField<string[]>;
    /** Runs after the field is updated. */
    onChange?: (values: string[]) => void;
  };

/** Design-system CheckboxGroup bound to a TanStack Form `string[]` field. */
export const CheckboxGroupField = ({
  field,
  label,
  description,
  caption,
  optional,
  onChange,
  ...groupProps
}: CheckboxGroupFieldProps) => {
  const errorMessage = useFieldError(field);
  // CheckboxGroup doesn't read FormGroup context, so the label and captions are wired here.
  const ids = useFieldGroupIds();

  return (
    <FieldGroup
      label={label}
      description={description}
      caption={caption}
      optional={optional}
      errorMessage={errorMessage}
      ids={ids}
    >
      <FocusBoundary
        onLeave={field.handleBlur}
        role="group"
        aria-labelledby={label != null ? ids.label : undefined}
        aria-describedby={describedBy(ids, { description, caption, errorMessage })}
      >
        <CheckboxGroup
          {...(groupProps as DistributiveOmit<CheckboxGroupProps, 'value' | 'onChange'>)}
          value={field.state.value}
          error={errorMessage !== undefined}
          onChange={(values) => {
            field.handleChange(values);
            onChange?.(values);
          }}
        />
      </FocusBoundary>
    </FieldGroup>
  );
};

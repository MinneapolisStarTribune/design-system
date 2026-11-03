'use client';

import { Switch, type SwitchProps } from '@minneapolisstartribune/design-system/web';
import { type BoundField, FieldGroup, FocusBoundary, useFieldError } from '../shared/field';

export interface SwitchFieldProps extends Omit<SwitchProps, 'selected' | 'onChange' | 'name'> {
  /** The field from `form.Field`'s render prop. Must be a boolean field. */
  field: BoundField<boolean>;
  /** Runs after the field is updated. */
  onChange?: (selected: boolean) => void;
}

/**
 * Design-system Switch bound to a TanStack Form boolean field. `label` and `caption` are the
 * switch's own; the validation error shows as a caption below it.
 */
export const SwitchField = ({ field, onChange, ...switchProps }: SwitchFieldProps) => {
  const errorMessage = useFieldError(field);

  return (
    <FieldGroup errorMessage={errorMessage}>
      <FocusBoundary onLeave={field.handleBlur}>
        <Switch
          {...switchProps}
          name={field.name}
          selected={field.state.value}
          onChange={(selected) => {
            field.handleChange(selected);
            onChange?.(selected);
          }}
        />
      </FocusBoundary>
    </FieldGroup>
  );
};

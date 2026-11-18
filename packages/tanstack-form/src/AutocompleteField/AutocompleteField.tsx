'use client';

import { useId } from 'react';
import {
  Autocomplete,
  type AutocompleteOption,
  type AutocompleteProps,
} from '@minneapolisstartribune/design-system/web';
import {
  type BoundField,
  FieldGroup,
  type FieldLabelProps,
  FocusBoundary,
  useFieldError,
} from '../shared/field';

export interface AutocompleteFieldProps<T extends AutocompleteOption = AutocompleteOption>
  extends Omit<AutocompleteProps<T>, 'id' | 'value' | 'onChange' | 'isError'>,
    FieldLabelProps {
  field: BoundField<string | null | undefined, string>;
  id?: string;
  onChange?: (value: string) => void;
}

/** Binds a single selection to a string field; clearing writes an empty string. */
export function AutocompleteField<T extends AutocompleteOption>({
  field,
  label,
  description,
  caption,
  optional,
  id: idProp,
  onChange,
  ...controlProps
}: AutocompleteFieldProps<T>) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorMessage = useFieldError(field);
  return (
    <FieldGroup
      label={label}
      description={description}
      caption={caption}
      optional={optional}
      errorMessage={errorMessage}
      htmlFor={id}
    >
      <FocusBoundary onLeave={field.handleBlur}>
        <Autocomplete
          {...controlProps}
          id={id}
          value={field.state.value ?? undefined}
          onChange={(next) => {
            const value = next ?? '';
            field.handleChange(value);
            onChange?.(value);
          }}
        />
      </FocusBoundary>
    </FieldGroup>
  );
}

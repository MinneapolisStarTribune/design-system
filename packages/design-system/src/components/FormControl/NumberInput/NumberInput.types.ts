import type { TextInputProps } from '../TextInput/web/TextInput';

type NumericValue = number | `${number}`;

export interface NumberInputProps
  extends Omit<
    TextInputProps,
    | 'type'
    | 'inputMode'
    | 'pattern'
    | 'placeholderText'
    | 'value'
    | 'defaultValue'
    | 'rounded'
    | 'isSuccess'
  > {
  /** Placeholder must be numeric for this control. */
  placeholderText?: NumericValue;
  /** Controlled numeric value represented as number or numeric string. */
  value?: NumericValue;
  /** Uncontrolled initial numeric value represented as number or numeric string. */
  defaultValue?: NumericValue;
}

import type { TextInputProps } from '../TextInput/web/TextInput';

type NumericValue = number | `${number}`;

export interface NumberInputProps
  extends Omit<
    TextInputProps,
    'type' | 'inputMode' | 'pattern' | 'placeholderText' | 'value' | 'defaultValue'
  > {
  /**
   * Regex used to validate typed/pasted input.
   * Can be a RegExp or pattern string. Defaults to digits-only.
   */
  validationRegex?: RegExp | string;
  /** Placeholder must be numeric for this control. */
  placeholderText?: NumericValue;
  /** Controlled numeric value represented as number or numeric string. */
  value?: NumericValue;
  /** Uncontrolled initial numeric value represented as number or numeric string. */
  defaultValue?: NumericValue;
}

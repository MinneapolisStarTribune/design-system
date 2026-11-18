import type { TextInputProps } from '../TextInput/web/TextInput';

export const DATEPICKER_SIZES = [
  'small',
  'medium',
  'large',
] as const satisfies readonly NonNullable<TextInputProps['size']>[];

export interface DateInputLimits {
  /** Earliest selectable date, inclusive (YYYY-MM-DD). */
  min?: string;
  /** Latest selectable date, inclusive (YYYY-MM-DD). */
  max?: string;
  required?: boolean;
}

export interface FormControlDatepickerProps
  extends Omit<
      TextInputProps,
      | 'type'
      | 'value'
      | 'defaultValue'
      | 'onChange'
      | 'icon'
      | 'iconPosition'
      | 'inputMode'
      | 'min'
      | 'max'
      | 'showSuccessIcon'
    >,
    DateInputLimits {
  /** Date-only YYYY-MM-DD, raw typed text, or null for an empty selection. */
  value?: string | null;
  defaultValue?: string | null;
  /** Emits YYYY-MM-DD for valid dates, an empty string on clear, or incomplete/invalid text. */
  onChange?: (value: string) => void;
  /** Accessible name of the calendar action and dialog. */
  calendarLabel?: string;
  /** Called when focus leaves the field, a date is selected, or native validation fails. */
  onTouched?: () => void;
}

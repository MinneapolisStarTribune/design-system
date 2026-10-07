import type {
  BaseTextInputProps,
  TextInputSize,
} from '@/components/FormControl/TextInput/TextInput.types';
import type {
  CalendarDate,
  StaticDatePickerProps,
} from '@/components/StaticDatePicker/StaticDatePicker.types';

export const DATE_PICKER_SIZES = [
  'small',
  'medium',
  'large',
] as const satisfies readonly TextInputSize[];

export interface DatePickerProps
  extends Pick<
      BaseTextInputProps,
      'size' | 'isDisabled' | 'isError' | 'placeholderText' | 'className' | 'dataTestId'
    >,
    Pick<StaticDatePickerProps, 'min' | 'max' | 'minMessage' | 'maxMessage'> {
  /** Selected date (controlled). Pass `null` for no selection. */
  value?: CalendarDate | null;
  /** Initially selected date when uncontrolled. */
  defaultValue?: CalendarDate | null;
  /**
   * Called when a date is picked from the calendar, or typed and committed (on blur or Enter).
   * Clearing the field calls it with `null`. Text that isn't a valid date, or is outside `min`/`max`,
   * doesn't call it; the field shows an error instead.
   */
  onChange?: (value: CalendarDate | null) => void;
  /** Submitted with a form as `YYYY-MM-DD`, through a hidden input. */
  name?: string;
  id?: string;
  /** Needed outside `FormGroup`, which otherwise labels the field. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

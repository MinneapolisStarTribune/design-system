import { type FormControlProps } from '../FormControl';

export interface BaseTextAreaProps extends Omit<FormControlProps, 'size'> {
  placeholderText?: string;
  isDisabled?: boolean;
  /** When true, shows error border. Falls back to FormGroup's caption state when omitted. */
  isError?: boolean;
  /** When true, shows success border. Falls back to FormGroup's caption state when omitted. */
  isSuccess?: boolean;
  /** Per-input tracking data merged into the blur event. Use to distinguish inputs (e.g. form_field, module_name). */
  analytics?: Record<string, unknown>;
}

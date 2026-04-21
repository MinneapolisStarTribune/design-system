import { type FormControlProps } from '../FormControl';

export type TextInputSize = NonNullable<FormControlProps['size']>;

export interface BaseTextInputProps extends FormControlProps {
  size?: TextInputSize;
  placeholderText?: string;
  /** Optional decorative icon element (e.g. <SearchIcon />). */
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  rounded?: boolean;
  isDisabled?: boolean;
  /** When true, shows error border. Parent/FormGroup manages validation state. */
  isError?: boolean;
  /** When true, shows success border. Parent/FormGroup manages validation state. */
  isSuccess?: boolean;
  /** Per-input tracking data merged into the blur event. Use to distinguish inputs (e.g. form_field, module_name). */
  analytics?: Record<string, unknown>;
}

import type { StyleProp, ViewStyle } from 'react-native';
import type { FormControlProps, FormControlSize } from '../../FormControl.native';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Native `FormControl.Select` props. Aligned with the web Select API, using React Native layout types. */
export interface SelectProps extends Omit<FormControlProps, 'style' | 'className'> {
  /** Stable id for the control (mirrors web). `nativeID` prefers `FormGroup` `inputId` when set. */
  id: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholderText?: string;
  showPlaceholder?: boolean;
  size?: FormControlSize;
  rounded?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

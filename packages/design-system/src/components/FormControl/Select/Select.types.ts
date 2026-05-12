import type { StyleProp, ViewStyle } from 'react-native';
import type { FormControlProps as FormControlNativeProps } from '../FormControl.native';
import type { FormControlProps as FormControlWebProps } from '../FormControl';

export type SelectSize = 'small' | 'medium' | 'large';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Shared base props across web + native.
 */
type SelectBaseProps = {
  /** Stable id for the control. */
  id: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholderText?: string;
  showPlaceholder?: boolean;
  size?: SelectSize;
  rounded?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  dataTestId?: string;
};

/**
 * Web props.
 */
export interface SelectProps extends FormControlWebProps, SelectBaseProps {
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

/**
 * React Native props.
 */
export interface SelectNativeProps
  extends Omit<FormControlNativeProps, 'style' | 'className'>,
    SelectBaseProps {
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

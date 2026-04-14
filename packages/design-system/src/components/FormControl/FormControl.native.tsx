import React from 'react';
import { TextInput as RNTextInput, type TextInput as RNTextInputRef } from 'react-native';
import { BaseProps, Size } from '@/types/globalTypes';

export type FormControlSize = Extract<Size, 'small' | 'medium' | 'large'>;

export interface FormControlProps extends BaseProps {
  size?: FormControlSize;
  isDisabled?: boolean;
}

type NativeTextInputProps = React.ComponentProps<typeof RNTextInput>;

interface FormControlTextInputProps
  extends Omit<FormControlProps, 'className' | 'style'>,
    Omit<NativeTextInputProps, 'editable' | 'testID'> {
  placeholderText?: string;
}

const FormControlTextInput = React.forwardRef<RNTextInputRef, FormControlTextInputProps>(
  function FormControlTextInput(props, ref) {
    const {
      placeholderText,
      placeholder,
      size: _size,
      isDisabled = false,
      dataTestId,
      ...rest
    } = props;

    return (
      <RNTextInput
        ref={ref}
        placeholder={placeholderText ?? placeholder}
        editable={!isDisabled}
        testID={dataTestId}
        {...rest}
      />
    );
  }
);

FormControlTextInput.displayName = 'FormControl.TextInput';

export const FormControl: React.FC<FormControlProps> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TextInput: React.ComponentType<any>;
} = () => {
  if (typeof console !== 'undefined' && console.error) {
    console.error(
      'FormControl must be used with a subcomponent (e.g., FormControl.TextInput). ' +
        'Use <FormControl.TextInput /> instead of <FormControl />.'
    );
  }
  return null;
};

FormControl.TextInput = FormControlTextInput;

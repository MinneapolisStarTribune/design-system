import React from 'react';
import { BaseProps } from '@/types/globalTypes';
import { TextInput } from './TextInput/TextInput';

export interface FormControlProps extends BaseProps {
  isDisabled?: boolean;
}

export const FormControl: React.FC<FormControlProps> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TextInput: React.ComponentType<any>;
  // Add any new form control subcomponents here
} = () => {
  if (typeof console !== 'undefined' && console.error) {
    console.error(
      'FormControl must be used with a subcomponent (e.g., FormControl.TextInput). ' +
        'Use <FormControl.TextInput /> instead of <FormControl />.'
    );
  }
  return null;
};

// Attach subcomponents
FormControl.TextInput = TextInput;
// Add any new form control subcomponents here

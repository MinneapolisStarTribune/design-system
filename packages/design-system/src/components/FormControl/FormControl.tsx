import React from 'react';
import { BaseProps, Size } from '@/types/globalTypes';
import { TextInput } from './TextInput/web/TextInput';
import { Checkbox } from './Checkbox/web/Checkbox';

export type FormControlSize = Extract<Size, 'small' | 'medium' | 'large'>;

export interface FormControlProps extends BaseProps {
  size?: FormControlSize;
  isDisabled?: boolean;
}

export const FormControl: React.FC<FormControlProps> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TextInput: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Checkbox: React.ComponentType<any>;
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
FormControl.Checkbox = Checkbox;
// Add any new form control subcomponents here

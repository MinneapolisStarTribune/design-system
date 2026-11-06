'use client';

import React from 'react';
import { BaseProps, Size } from '@/types/globalTypes';
import { TextInput } from './TextInput/web/TextInput';
import { TextArea } from './TextArea/web/TextArea';
import { NumberInput } from './NumberInput/web/NumberInput';
import { PasswordInput } from './PasswordInput/web/PasswordInput';
import { Checkbox } from './Checkbox/web/Checkbox';
import { CheckboxGroup } from './CheckboxGroup/web/CheckboxGroup';
import { RadioGroup } from './RadioGroup/web/RadioGroup';
import { Select } from './Select/web/Select';
import { MultiSelect } from './MultiSelect/web/MultiSelect';
import { Switch } from './Switch/web/Switch';
import { FormControlDatepicker } from './Datepicker/web/Datepicker';

export type FormControlSize = Extract<Size, 'small' | 'medium' | 'large'>;

export interface FormControlProps extends BaseProps {
  size?: FormControlSize;
  isDisabled?: boolean;
}

export const FormControl: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TextInput: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TextArea: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NumberInput: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PasswordInput: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Checkbox: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CheckboxGroup: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RadioGroup: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Select: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MultiSelect: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Switch: React.ComponentType<any>;
  Datepicker: typeof FormControlDatepicker;
} = {
  TextInput,
  TextArea,
  NumberInput,
  PasswordInput,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Select,
  MultiSelect,
  Switch,
  Datepicker: FormControlDatepicker,
};

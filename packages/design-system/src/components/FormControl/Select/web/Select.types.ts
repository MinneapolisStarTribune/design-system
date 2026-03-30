import { FormControlProps } from '@/components/FormControl/FormControl';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends FormControlProps {
  id: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholderText?: string;
  showPlaceholder?: boolean;
  size?: 'small' | 'medium' | 'large';
  rounded?: boolean;
  isDisabled?: boolean;
  isError?: boolean;

  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  dataTestId?: string;
}

import type { BaseProps } from '@/types/globalTypes';

export type MultiSelectSize = 'small' | 'medium' | 'large';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps extends BaseProps {
  id?: string;
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholderText?: string;
  size?: MultiSelectSize;
  rounded?: boolean;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

import { RadioColor } from '@/index.web';

export interface RadioOption {
  value: string;
  title: string;
  description?: string;
}

export interface BaseRadioGroupProps {
  name: string;
  value: string | null | undefined;
  options: RadioOption[];
  color?: RadioColor;
  disabled?: boolean;
  error?: boolean;
  onChange: (value: string) => void;
}

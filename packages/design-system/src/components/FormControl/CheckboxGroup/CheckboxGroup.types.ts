import type { StyleProp, ViewStyle } from 'react-native';
import type { BaseProps } from '@/types/globalTypes';

export interface CheckboxOption {
  value: string;
  title: string;
  description?: string;
}

export interface CheckboxCategory {
  parentOption: CheckboxOption;
  options: CheckboxOption[];
}

type CheckboxGroupSelectionMode =
  | { options: CheckboxOption[]; categories?: never }
  | { categories: CheckboxCategory[]; options?: never };

interface CheckboxGroupBaseProps {
  value: string[];
  color?: 'neutral' | 'brand';
  disabled?: boolean;
  error?: boolean;
  onChange: (values: string[]) => void;
  analytics?: Record<string, unknown>;
}

export type CheckboxGroupProps = BaseProps & CheckboxGroupBaseProps & CheckboxGroupSelectionMode;

export type CheckboxGroupNativeProps = Omit<BaseProps, 'className' | 'style'> &
  CheckboxGroupBaseProps &
  CheckboxGroupSelectionMode & {
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
  };

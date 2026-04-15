import type { StyleProp, ViewStyle } from 'react-native';
import type { BaseProps } from '@/types/globalTypes';

export const CHECKBOX_VARIANTS = ['neutral', 'brand'] as const;
export type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];

export interface CheckboxProps extends Omit<BaseProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Required label text */
  title: string;
  /** Optional supporting text below the title */
  description?: string;
  /** Controlled checked state */
  checked: boolean;
  /**
   * Indeterminate (mixed) state — visual only; set programmatically.
   * When the user activates the control, `onChange(true)` is called so the parent can clear indeterminate.
   */
  indeterminate?: boolean;
  /** Color variant — neutral is the default */
  variant?: CheckboxVariant;
  disabled?: boolean;
  error?: boolean;
  onChange: (checked: boolean) => void;
}

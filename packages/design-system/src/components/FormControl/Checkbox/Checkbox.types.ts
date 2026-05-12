import type { StyleProp, ViewStyle } from 'react-native';
import type { BaseProps } from '@/types/globalTypes';

/** Shared by web and native checkboxes. */
export const CHECKBOX_VARIANTS = ['neutral', 'brand'] as const;
export type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];

/** Web-only size scale. */
export const CHECKBOX_SIZES = ['default', 'small'] as const;
export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

/** Web `FormControl.Checkbox` — DOM label and className. */
export interface CheckboxProps extends BaseProps {
  /** Required label text for the checkbox */
  label: string;
  /** Controlled checked state */
  checked: boolean;
  /**
   * Indeterminate state - a visual state indicating mixed selection.
   * Must be set programmatically; user interaction transitions to checked or unchecked.
   */
  indeterminate?: boolean;
  /** Color variant. Neutral is default; brand is for specific uses within a brand. */
  variant?: CheckboxVariant;
  /** Optional caption text below the label */
  caption?: string;
  /** Size of the checkbox */
  size?: CheckboxSize;
  /** Disabled state */
  disabled?: boolean;
  /** Error state - shows error styling and communicates to assistive technologies */
  error?: boolean;
  /** When true, checkbox can receive focus. When false, cannot be focused (e.g. tabIndex=-1). */
  focus?: boolean;
  /** Callback when checked state changes */
  onChange: (checked: boolean) => void;
  /** Per-checkbox tracking data merged into the event. Use to distinguish checkboxes (e.g. form_field, module_name). */
  analytics?: Record<string, unknown>;
}

/** React Native — no `className`; `style` uses RN layout types. */
export interface CheckboxNativeProps extends Omit<BaseProps, 'style' | 'className'> {
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

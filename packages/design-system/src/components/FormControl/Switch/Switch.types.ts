import type { FormControlProps as FormControlWebProps } from '../FormControl';

export const SWITCH_COLORS = ['neutral', 'brand'] as const;
export type SwitchColor = (typeof SWITCH_COLORS)[number];

export const SWITCH_SIZES = ['small', 'medium', 'large'] as const;
export type SwitchSize = (typeof SWITCH_SIZES)[number];

export interface BaseSwitchProps extends FormControlWebProps {
  /** Controlled selected state. */
  selected: boolean;
  /** Callback fired with the next selected state. */
  onChange: (selected: boolean) => void;
  /** Optional visible label. */
  label?: string;
  /** Optional position of the label relative to the switch. */
  labelPosition?: 'start' | 'end';
  /** Optional visible caption. */
  caption?: string;
  /** Visual color variant. Neutral is default. */
  color?: SwitchColor;
  /** Visual size. Medium is default. */
  size?: SwitchSize;
  /** Optional input id. Uses FormGroup id when present. */
  id?: string;
  /** Optional input name for form integrations. */
  name?: string;
}

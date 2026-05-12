import { BaseProps } from '@/types/globalTypes';

export const RADIO_COLORS = ['neutral', 'brand'] as const;
export type RadioColor = (typeof RADIO_COLORS)[number];

export interface RadioProps extends BaseProps {
  id?: string;
  name?: string;
  label: string;
  description?: string;
  checked: boolean;
  color?: RadioColor;
  disabled?: boolean;
  error?: boolean;
  onChange: (checked: boolean) => void;
}

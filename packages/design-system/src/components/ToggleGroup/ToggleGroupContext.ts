'use client';

import { createContext, useContext } from 'react';
import type { ToggleGroupType } from './ToggleGroup.types';

export interface ToggleGroupContextValue {
  type: ToggleGroupType;
  name: string;
  disabled: boolean;
  dataTestId: string;
  isSelected: (value: string) => boolean;
  onItemChange: (value: string, checked: boolean) => void;
}

export const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export const useToggleGroupContext = (): ToggleGroupContextValue => {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error('ToggleGroup.Item must be rendered inside ToggleGroup.Root');
  }
  return context;
};

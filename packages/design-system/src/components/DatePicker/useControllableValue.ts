import { useState } from 'react';

/** `value` when it's passed (controlled), otherwise internal state seeded from `defaultValue`. */
export const useControllableValue = <T>(value: T | undefined, defaultValue: T) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;

  const setValue = (next: T) => {
    if (!isControlled) setUncontrolledValue(next);
  };

  return [isControlled ? value : uncontrolledValue, setValue] as const;
};

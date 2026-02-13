import { createContext, useContext } from 'react';

type PopoverContextValue = {
  close: () => void;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export const usePopoverContext = () => {
  const ctx = useContext(PopoverContext);

  if (!ctx) {
    throw new Error('Popover components must be used within <Popover>');
  }

  return ctx;
};

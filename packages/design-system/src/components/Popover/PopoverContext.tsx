'use client';

import { createContext, useContext } from 'react';

type PopoverContextValue = {
  close: () => void;
  /** Heading ID. The surface uses it only while a heading is mounted. */
  headingId: string;
  setHasHeading: (hasHeading: boolean) => void;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export const usePopoverContext = () => {
  const ctx = useContext(PopoverContext);

  if (!ctx) {
    throw new Error('Popover components must be used within <Popover.Root>');
  }

  return ctx;
};

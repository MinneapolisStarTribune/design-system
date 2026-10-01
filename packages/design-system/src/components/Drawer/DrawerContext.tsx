'use client';

import { createContext, useContext } from 'react';

type DrawerContextValue = {
  headingId: string;
  // Heading reports while mounted, so aria-labelledby only points at a real id.
  setHasHeading: (hasHeading: boolean) => void;
  bodyId: string;
  // Body reports the same way, so aria-describedby only points at a real id.
  setHasBody: (hasBody: boolean) => void;
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export const useDrawerContext = () => {
  const ctx = useContext(DrawerContext);

  if (!ctx) {
    throw new Error('Drawer components must be used within <Drawer.Root>');
  }

  return ctx;
};

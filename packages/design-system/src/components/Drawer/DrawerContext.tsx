'use client';

import { createContext, useContext } from 'react';

type DrawerContextValue = {
  headingId: string;
  descriptionId: string;
  // Heading/Description report while mounted, so aria-labelledby/-describedby only point at real ids.
  setHasHeading: (hasHeading: boolean) => void;
  setHasDescription: (hasDescription: boolean) => void;
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export const useDrawerContext = () => {
  const ctx = useContext(DrawerContext);

  if (!ctx) {
    throw new Error('Drawer components must be used within <Drawer>');
  }

  return ctx;
};

'use client';

import { createContext, useContext } from 'react';
import type { ModalComponentName } from './Modal.types';

type ModalContextValue = {
  headingId: string;
  // Heading reports while mounted, so aria-labelledby only points at a real id.
  setHasHeading: (hasHeading: boolean) => void;
  bodyId: string;
  // Body reports the same way, so aria-describedby only points at a real id.
  setHasBody: (hasBody: boolean) => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = (componentName: ModalComponentName) => {
  const ctx = useContext(ModalContext);

  if (!ctx) {
    throw new Error(`${componentName} components must be used within <${componentName}.Root>`);
  }

  return ctx;
};

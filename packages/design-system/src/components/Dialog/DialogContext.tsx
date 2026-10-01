'use client';

import { createContext, useContext } from 'react';

// Lets sections fail with a Dialog error rather than the Drawer one they'd otherwise hit.
export const DialogContext = createContext(false);

export const useDialogContext = () => {
  const isInDialog = useContext(DialogContext);

  if (!isInDialog) {
    throw new Error('Dialog components must be used within <Dialog.Root>');
  }
};

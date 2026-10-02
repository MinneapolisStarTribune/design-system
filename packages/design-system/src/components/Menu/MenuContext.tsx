'use client';

import { createContext, useContext } from 'react';

type MenuContextValue = {
  /** Items call this to close the menu after a selection. */
  closeFromItem: () => void;
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export const useMenuContext = () => {
  const ctx = useContext(MenuContext);

  if (!ctx) {
    throw new Error('Menu components must be used within <Menu.Root>');
  }

  return ctx;
};

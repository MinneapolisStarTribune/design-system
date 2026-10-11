'use client';

import { createContext, useContext } from 'react';
import type { UseInteractionsReturn } from '@floating-ui/react';

type MenuContextValue = {
  activeIndex: number | null;
  getItemProps: UseInteractionsReturn['getItemProps'];
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

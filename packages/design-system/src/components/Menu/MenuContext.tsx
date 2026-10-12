'use client';

import { createContext, useContext } from 'react';
import type { useInteractions } from '@floating-ui/react';

type MenuContextValue = {
  activeIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  /** Closes the whole menu, submenus included. */
  closeFromItem: () => void;
  /** Portal root and overflow boundary, shared with submenus. */
  boundary: HTMLElement | undefined;
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export const useMenuContext = () => {
  const ctx = useContext(MenuContext);

  if (!ctx) {
    throw new Error('Menu components must be used within <Menu.Root>');
  }

  return ctx;
};

'use client';

import React, { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';

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

/**
 * ADVANCED: Optional context for the portal root element. When set, Popover content renders into this
 * node instead of document.body. Prefer `PopoverPortalRootProvider` for most cases; use this
 * context directly only when you need to supply an existing HTMLElement (e.g. from a ref).
 */
export const PopoverPortalRootContext = createContext<HTMLElement | null>(null);

/**
 * For when you want more customization over where popover content renders.
 * Wraps children in a div and provides that div as the portal root via context. Any Popover
 * rendered under this provider will portal into this container instead of document.body.
 * Use for modals, sidebars, or Storybook so overlay content stays within the desired container.
 */
export const PopoverPortalRootProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setRoot(ref.current);
  }, []);

  return (
    <PopoverPortalRootContext.Provider value={root}>
      <div ref={ref} style={{ minHeight: '100%', isolation: 'isolate' }}>
        {children}
      </div>
    </PopoverPortalRootContext.Provider>
  );
};

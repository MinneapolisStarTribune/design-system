'use client';

import React, { createContext, useLayoutEffect, useRef, useState } from 'react';

/**
 * Context for the portal root element. When set, Tooltip content renders into this
 * node instead of document.body. Use this context to provide a custom portal root
 * (e.g. for Storybook or when tooltips should stay within a specific container).
 */
export const TooltipPortalRootContext = createContext<HTMLElement | null>(null);

/**
 * Provider that manages the portal root for Tooltip components.
 * Wraps children in a div and provides that div as the portal root via context.
 * Any Tooltip rendered under this provider will portal into this container instead of document.body.
 * Use for modals, sidebars, or Storybook so overlay content stays within the desired container.
 */
export const TooltipPortalRootProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setRoot(ref.current);
  }, []);

  return (
    <TooltipPortalRootContext.Provider value={root}>
      <div ref={ref} style={{ minHeight: '100%', isolation: 'isolate' }}>
        {children}
      </div>
    </TooltipPortalRootContext.Provider>
  );
};

'use client';

import { createContext, useCallback, useContext, useState, type FC, type ReactNode } from 'react';

interface ExternalTriggerContextValue {
  triggered: Record<string, unknown>;
  trigger: (id: string, payload?: unknown) => void;
  dismiss: (id: string) => void;
}

const defaultContextValue: ExternalTriggerContextValue = {
  triggered: {},
  trigger: () => {},
  dismiss: () => {},
};

const ExternalTriggerContext = createContext<ExternalTriggerContextValue>(defaultContextValue);

export type ExternalTriggerProviderProps = {
  children: ReactNode;
};

/**
 * Generic "id → payload" trigger registry: lets any code outside a component (a vendor SDK
 * integration, an imperative script, or just a sibling/ancestor component) open/address that
 * component by an arbitrary string id, optionally carrying a typed payload. Consumed internally by
 * `Popover` via its optional `triggerId`/`externalContent` props, but usable standalone by any
 * component that wants the same capability.
 */
export const ExternalTriggerProvider: FC<ExternalTriggerProviderProps> = ({ children }) => {
  const [triggered, setTriggered] = useState<Record<string, unknown>>({});

  // Functional setState updaters keep `trigger`/`dismiss` referentially stable forever (empty
  // deps), which matters because callers may capture them once in a mount-only effect/closure
  // (e.g. a vendor SDK integration registering a callback on mount) and call them arbitrarily
  // later — an identity that changes across renders would silently stop working for such callers.
  const trigger = useCallback((id: string, payload?: unknown) => {
    setTriggered((prev) => ({ ...prev, [id]: payload ?? true }));
  }, []);

  const dismiss = useCallback((id: string) => {
    setTriggered((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  return (
    <ExternalTriggerContext.Provider value={{ triggered, trigger, dismiss }}>
      {children}
    </ExternalTriggerContext.Provider>
  );
};

/**
 * Consumed internally by any component (e.g. `Popover`) that accepts an optional `triggerId` prop
 * to opt into being externally addressable. Returns a safe no-op default when `id` is undefined or
 * there's no `ExternalTriggerProvider` ancestor.
 */
export function useExternalTriggerState<T = unknown>(
  id: string | undefined
): { isTriggered: boolean; payload: T | undefined; dismiss: () => void } {
  const { triggered, dismiss: contextDismiss } = useContext(ExternalTriggerContext);

  const dismiss = useCallback(() => {
    if (id) contextDismiss(id);
  }, [id, contextDismiss]);

  if (!id) {
    return { isTriggered: false, payload: undefined, dismiss };
  }

  return { isTriggered: id in triggered, payload: triggered[id] as T | undefined, dismiss };
}

/**
 * Returns the stable `trigger` function for code that fires triggers by id from outside the
 * triggered component itself — e.g. a vendor SDK integration.
 */
export function useTriggerExternal<T = unknown>(): (id: string, payload?: T) => void {
  const { trigger } = useContext(ExternalTriggerContext);
  return trigger as (id: string, payload?: T) => void;
}

import { act } from '@testing-library/react';

/**
 * Points `window.matchMedia` at a fake viewport width so `min-width` queries match it.
 * Call `resize` to cross breakpoints (notifies change listeners) and `restore` in cleanup.
 */
export const mockViewport = (initialWidth: number) => {
  const originalMatchMedia = window.matchMedia;
  const listeners = new Set<() => void>();
  let width = initialWidth;

  window.matchMedia = (query: string) => {
    const minWidth = Number(/min-width:\s*(\d+)px/.exec(query)?.[1] ?? 0);

    return {
      get matches() {
        return width >= minWidth;
      },
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
  };

  return {
    resize: (nextWidth: number) => {
      width = nextWidth;
      act(() => listeners.forEach((listener) => listener()));
    },
    restore: () => {
      window.matchMedia = originalMatchMedia;
    },
  };
};

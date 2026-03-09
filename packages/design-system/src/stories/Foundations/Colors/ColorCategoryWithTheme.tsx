/**
 * Loads theme CSS when rendered in MDX (where the preview decorator may not wrap content).
 * Ensures theme CSS is injected and stays in sync with Storybook toolbar brand/theme.
 */
import React, { useEffect, useState } from 'react';
import { loadTheme } from '../../../../.storybook/theme-wrapper';

type Brand = 'startribune' | 'varsity';
type ColorScheme = 'light' | 'dark';

interface StorybookGlobals {
  brand?: string;
  theme?: string;
}

declare global {
  interface Window {
    __STORYBOOK_GLOBALS__?: StorybookGlobals;
  }
}

function getGlobals(): { brand: Brand; colorScheme: ColorScheme } {
  const g: StorybookGlobals = (typeof window !== 'undefined' && window.__STORYBOOK_GLOBALS__) || {};
  return {
    brand: (g.brand || 'startribune') as Brand,
    colorScheme: (g.theme === 'dark' ? 'dark' : 'light') as ColorScheme,
  };
}

export const ThemeLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globals, setGlobals] = useState(getGlobals);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadTheme(globals.brand, globals.colorScheme).then(() => {
      if (!cancelled) setThemeLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [globals.brand, globals.colorScheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getGlobals();
      setGlobals((prev) =>
        prev.brand !== next.brand || prev.colorScheme !== next.colorScheme ? next : prev
      );
    }, 400);
    return () => clearInterval(interval);
  }, []);

  if (!themeLoaded) {
    return <div>Loading theme...</div>;
  }

  return <>{children}</>;
};

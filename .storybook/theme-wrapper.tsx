/**
 * ThemeWrapper Component
 *
 * This component is responsible for dynamically loading CSS theme files in Storybook.
 * It ensures that the correct design tokens (CSS variables) are available in the DOM
 * before rendering child components.
 *
 * Why this exists:
 * - Our design system uses CSS variables (e.g., --color-icon-on-light-primary) that are
 *   defined in theme CSS files (dist/web/themes/{brand}-{colorScheme}.css)
 * - These CSS files must be loaded into the DOM for components to use the variables
 * - Storybook needs to dynamically switch between brands (startribune/varsity) and
 *   color schemes (light/dark) based on user selection in the toolbar
 *
 * How it works:
 * 1. Takes brand and colorScheme props to determine which CSS file to load
 * 2. Dynamically creates a <link> element pointing to the correct theme CSS file
 * 3. Injects it into the document head, replacing any previously loaded theme
 * 4. Shows a loading state until the CSS is loaded
 * 5. Only renders children after the theme CSS is available
 *
 * The theme CSS files are served from /themes/ via Storybook's staticDirs configuration
 * (see .storybook/main.ts). Files are named: {brand}-{colorScheme}.css
 * (e.g., startribune-light.css, varsity-dark.css)
 */

import React, { useEffect, useState } from 'react';

/**
 * Loads a theme CSS file into the document head
 *
 * @param brand - The brand name ('startribune' or 'varsity')
 * @param colorScheme - The color scheme ('light' or 'dark')
 * @returns Promise that resolves when the CSS is loaded (or after timeout)
 *
 */
export const loadTheme = (brand: string, colorScheme: 'light' | 'dark'): Promise<void> => {
  return new Promise((resolve) => {
    // Remove any existing theme link
    const existingLink = document.getElementById('storybook-theme-link');
    if (existingLink) {
      existingLink.remove();
    }

    // Load the correct theme file based on brand and color scheme
    const themeFileName = `${brand}-${colorScheme}.css`;
    const link = document.createElement('link');
    link.id = 'storybook-theme-link';
    link.rel = 'stylesheet';
    link.href = `/themes/${themeFileName}`;

    // Wait for CSS to load
    link.onload = () => resolve();
    link.onerror = () => {
      console.error(`Failed to load theme: ${themeFileName}`);
      resolve(); // Resolve anyway to not block rendering
    };

    document.head.appendChild(link);

    // Fallback: resolve after a short delay if onload doesn't fire
    setTimeout(() => resolve(), 100);
  });
};

/**
 * ThemeWrapper Component
 *
 * A wrapper component that ensures theme CSS is loaded before rendering children.
 * This prevents components from rendering with undefined CSS variables.
 *
 * @param children - React nodes to render after theme loads
 * @param brand - Brand name ('startribune' or 'varsity')
 * @param colorScheme - Color scheme ('light' or 'dark')
 *
 * Behavior:
 * - Shows "Loading theme..." while CSS is being loaded
 * - Automatically reloads theme when brand or colorScheme changes
 * - Only renders children once the theme CSS is available in the DOM
 */
export const ThemeWrapper = ({
  children,
  brand,
  colorScheme,
}: {
  children: React.ReactNode;
  brand: string;
  colorScheme: 'light' | 'dark';
}) => {
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    loadTheme(brand, colorScheme).then(() => {
      setThemeLoaded(true);
    });
  }, [brand, colorScheme]);

  if (!themeLoaded) {
    return <div>Loading theme...</div>;
  }

  return <>{children}</>;
};

/**
 * FontWrapper Component
 *
 * This component is responsible for dynamically loading font-face CSS files in Storybook.
 * It ensures that the correct @font-face definitions are available in the DOM
 * before rendering child components.
 *
 * Why this exists:
 * - Our design system uses brand-specific fonts (@font-face definitions) that are
 *   defined in CSS files (dist/web/fonts/font-face/{brand}.css)
 * - These CSS files must be loaded into the DOM for components to use the fonts
 * - Storybook needs to dynamically switch between brands (startribune/varsity) based
 *   on user selection in the toolbar
 * - Note: Typography classes and CSS variables are now loaded by ThemeWrapper
 *   (combined in {brand}-{colorScheme}.css files)
 *
 * How it works:
 * 1. Takes brand prop to determine which brand-specific font-face file to load
 * 2. Dynamically creates <link> element pointing to the correct font-face CSS file
 * 3. Injects it into the document head, replacing any previously loaded fonts
 * 4. Shows a loading state until the fonts are loaded
 * 5. Only renders children after the font CSS is available
 *
 * The font-face CSS files are served from /fonts/font-face/ via Storybook's staticDirs configuration
 * (see .storybook/main.ts). Files are organized as:
 * - /fonts/font-face/{brand}.css - @font-face definitions
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { Brand } from '../src/providers/TamaguiProvider';

const FONT_LINK_PREFIX = 'storybook-font-link';

const FONT_CSS_PATHS = [
  (brand: Brand) => `/fonts/font-face/${brand}.css`, // @font-face definitions only
];

/**
 * Loads a brand font-face CSS file into the document head
 *
 * This is used to ensure that the correct font is loaded before rendering components.
 *
 * @param href - The CSS file URL to load
 * @param id - The unique ID for the link element
 * @returns Promise that resolves when the CSS is loaded
 */
const loadCss = (href: string, id: string): Promise<void> => {
  return new Promise((resolve) => {
    const existing = document.getElementById(id) as HTMLLinkElement | null;

    if (existing) {
      existing.remove();
    }

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = () => resolve();
    link.onerror = () => {
      console.error(`Failed to load CSS: ${href}`);
      resolve(); // Resolve anyway to not block rendering
    };

    document.head.appendChild(link);

    // Fallback: resolve after a short delay if onload doesn't fire
    setTimeout(() => resolve(), 100);
  });
};

interface FontWrapperProps {
  brand: Brand;
  children: ReactNode;
}

/**
 * FontWrapper Component
 *
 * A wrapper component that ensures font is loaded before rendering children.
 *
 * @param children - React nodes to render after font loads
 * @param brand - Brand name ('startribune' | 'varsity')
 *
 * Behavior:
 * - Shows "Loading font..." while font is being loaded
 * - Automatically reloads font when brand changes
 * - Only renders children once the font is available in the DOM
 */
export const FontWrapper = ({ children, brand }: FontWrapperProps) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    setFontLoaded(false);

    Promise.all(
      FONT_CSS_PATHS.map((getPath) => {
        const href = getPath(brand);

        const id = `${FONT_LINK_PREFIX}-font-face-${brand}`;
        return loadCss(href, id);
      })
    ).then(() => {
      setFontLoaded(true);
    });
  }, [brand]);

  if (!fontLoaded) {
    return <div>Loading font...</div>;
  }

  return <>{children}</>;
};

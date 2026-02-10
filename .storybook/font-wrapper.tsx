/**
 * FontWrapper Component
 *
 * This component is responsible for dynamically loading font CSS files in Storybook.
 * It ensures that the correct font faces, utility typography classes, and editorial
 * typography classes are available in the DOM before rendering child components.
 *
 * Why this exists:
 * - Our design system uses brand-specific fonts (@font-face definitions) and typography
 *   classes that are defined in CSS files (dist/fonts/font-face/{brand}.css,
 *   dist/fonts/utility/{brand}.css, dist/fonts/editorial/{brand}.css)
 * - These CSS files must be loaded into the DOM for components to use the fonts
 * - Storybook needs to dynamically switch between brands (startribune/varsity) based
 *   on user selection in the toolbar
 *
 * How it works:
 * 1. Takes brand prop to determine which brand-specific font files to load
 * 2. Always loads utility fonts (shared across brands, but brand-specific files)
 * 3. Dynamically creates <link> elements pointing to the correct font CSS files
 * 4. Injects them into the document head, replacing any previously loaded fonts
 * 5. Shows a loading state until the fonts are loaded
 * 6. Only renders children after the font CSS is available
 *
 * The font CSS files are served from /fonts/ via Storybook's staticDirs configuration
 * (see .storybook/main.ts). Files are organized as:
 * - /fonts/font-face/{brand}.css - @font-face definitions
 * - /fonts/utility/{brand}.css - Utility typography classes
 * - /fonts/editorial/{brand}.css - Editorial typography classes
 */

import { ReactNode, useEffect, useState } from 'react';
import { Brand } from '../src/providers/MantineProvider';

const FONT_LINK_PREFIX = 'storybook-font-link';

const FONT_CSS_PATHS = [
  (brand: Brand) => `/fonts/font-face/${brand}.css`,
  (brand: Brand) => `/fonts/utility/${brand}.css`,
  (brand: Brand) => `/fonts/editorial/${brand}.css`,
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

        const folderName = href.split('/')[2]; // e.g., 'font-face', 'utility', 'editorial'
        const id = `${FONT_LINK_PREFIX}-${folderName}-${brand}`;
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

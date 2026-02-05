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

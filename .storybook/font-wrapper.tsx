import { ReactNode, useEffect, useState } from 'react';
import { Brand } from '../src/providers/MantineProvider';

/**
 * Loads a brand font-face CSS file into the document head
 *
 * This is used to ensure that the correct font is loaded before rendering components.
 *
 * @param brand - Brand name ('startribune' | 'varsity')
 * @returns Promise that resolves when the font CSS is loaded
 */
export const loadFont = (brand: Brand): Promise<void> => {
  return new Promise((resolve) => {
    // Remove any existing font link
    const existingLink = document.getElementById('storybook-font-link');
    if (existingLink) {
      existingLink.remove();
    }

    // Load the correct font file based on brand
    const fontFileName = `${brand}-font-faces.css`;
    const link = document.createElement('link');

    link.id = 'storybook-font-link';
    link.rel = 'stylesheet';
    link.href = `/fonts/${fontFileName}`;

    link.onload = () => resolve();
    link.onerror = () => {
      console.error(`Failed to load font: ${fontFileName}`);
      resolve(); // Resolve anyway to not block rendering
    };

    document.head.appendChild(link);

    // Fallback: resolve after a short delay if onload doesn't fire
    setTimeout(() => resolve(), 100);
  });
};

interface FontWrapperProps {
  children: ReactNode;
  brand: Brand;
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

    loadFont(brand).then(() => {
      setFontLoaded(true);
    });
  }, [brand]);

  if (!fontLoaded) {
    return <div>Loading font...</div>;
  }

  return <>{children}</>;
};

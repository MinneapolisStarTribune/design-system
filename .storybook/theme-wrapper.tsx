import React, { useEffect, useState } from 'react';

// Function to load theme CSS
const loadTheme = (brand: string): Promise<void> => {
  return new Promise((resolve) => {
    // Remove any existing theme link
    const existingLink = document.getElementById('storybook-theme-link');
    if (existingLink) {
      existingLink.remove();
    }

    // Create and inject the theme CSS link
    const link = document.createElement('link');
    link.id = 'storybook-theme-link';
    link.rel = 'stylesheet';
    link.href = `/themes/${brand}.css`;

    // Wait for CSS to load
    link.onload = () => resolve();
    link.onerror = () => {
      console.error(`Failed to load theme: ${brand}.css`);
      resolve(); // Resolve anyway to not block rendering
    };

    document.head.appendChild(link);

    // Fallback: resolve after a short delay if onload doesn't fire
    setTimeout(() => resolve(), 100);
  });
};

export const ThemeWrapper = ({ children, brand }: { children: React.ReactNode; brand: string }) => {
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    loadTheme(brand).then(() => {
      setThemeLoaded(true);
    });
  }, [brand]);

  if (!themeLoaded) {
    return <div>Loading theme...</div>;
  }

  return <>{children}</>;
};

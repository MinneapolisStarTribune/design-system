import { useEffect } from 'react';

export type ThemeCssLoaderProps = {
  colorScheme: 'light' | 'dark';
  brand: 'startribune' | 'varsity';
};

export function ThemeCssLoader({ colorScheme, brand }: ThemeCssLoaderProps) {
  useEffect(() => {
    const componentsId = 'code-editor-components-css-link';
    const themeId = 'code-editor-theme-link';

    const removeIfExists = (id: string) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };

    removeIfExists(componentsId);
    removeIfExists(themeId);

    const componentsLink = document.createElement('link');
    componentsLink.id = componentsId;
    componentsLink.rel = 'stylesheet';

    // Make theme loading work even if Storybook is served under a subpath.
    // (Playground renders inside an iframe, so '/...' can point to the wrong place.)
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
    componentsLink.href = basePath + '/components.css';
    document.head.appendChild(componentsLink);

    const themeLink = document.createElement('link');
    themeLink.id = themeId;
    themeLink.rel = 'stylesheet';
    themeLink.href = basePath + '/' + brand + '-' + colorScheme + '.css';
    document.head.appendChild(themeLink);

    return () => {
      componentsLink.remove();
      themeLink.remove();
    };
  }, [colorScheme, brand]);

  return null;
}

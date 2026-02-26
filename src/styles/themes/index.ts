import type { Brand, ColorScheme } from '../../providers/theme-helpers';

const PACKAGE_NAME = '@minneapolisstartribune/design-system';

/**
 * Returns the theme CSS file path for a specific brand and color scheme (package-relative path).
 * Useful for documentation, bundler config, or when resolving the URL yourself.
 */
export function getThemeCSSPath(brand: Brand, colorScheme: ColorScheme): string {
  return `${PACKAGE_NAME}/dist/web/themes/${brand}-${colorScheme}.css`;
}

/**
 * Relative path from the built script to the theme file (for runtime link href).
 * Used internally by loadThemeCSS so the link resolves when the script is loaded.
 * 
 * In Storybook: Uses absolute path /themes/ (served via staticDirs)
 * In production: Uses relative path ./themes/ (relative to the script location)
 */
function getThemeCSSRelativePath(brand: Brand, colorScheme: ColorScheme): string {
  // Detect if we're in Storybook (check for Storybook-specific globals or window location)
  const isStorybook = typeof window !== 'undefined' && (
    window.location?.pathname?.includes('/iframe.html') ||
    (window as any).__STORYBOOK_ENV__ ||
    window.parent !== window // Storybook runs in an iframe
  );
  
  if (isStorybook) {
    // Storybook serves files from staticDirs at root, so use absolute path
    return `/themes/${brand}-${colorScheme}.css`;
  }
  
  // Production: use relative path
  return `./themes/${brand}-${colorScheme}.css`;
}

const LINK_ID_PREFIX = 'design-system-theme-';

/**
 * Loads theme-specific CSS by injecting a link element.
 * Replaces any existing theme CSS link to support dynamic theme switching (e.g., in Storybook).
 * Idempotent: safe to call multiple times for the same brand/colorScheme.
 */
export function loadThemeCSS(brand: Brand, colorScheme: ColorScheme): void {
  const relativePath = getThemeCSSRelativePath(brand, colorScheme);
  if (!relativePath) {
    return;
  }

  const linkId = `${LINK_ID_PREFIX}${brand}-${colorScheme}`;
  
  // Check if the correct theme is already loaded
  const existingLink = document.getElementById(linkId);
  if (existingLink) {
    return;
  }

  // Remove any existing theme CSS links (for theme switching)
  const allThemeLinks = document.querySelectorAll(`link[id^="${LINK_ID_PREFIX}"]`);
  allThemeLinks.forEach((link) => {
    link.remove();
  });
  
  // Force a reflow to ensure old CSS is removed
  void document.documentElement.offsetHeight;

  // Create and add the new theme CSS link
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  // Add cache-busting query parameter to ensure fresh CSS on theme switch
  link.href = `${relativePath}?v=${Date.now()}`;
  
  link.onerror = () => {
    console.error(`Failed to load theme CSS: ${linkId}`);
  };
  
  document.head.appendChild(link);
}

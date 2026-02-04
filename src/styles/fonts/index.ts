import type { Brand } from '../../providers/theme-helpers';

const PACKAGE_NAME = '@minneapolisstartribune/design-system';

/**
 * Returns the font CSS file path for a specific brand (package-relative path).
 * Useful for documentation, bundler config, or when resolving the URL yourself.
 */
export function getBrandFontPath(brand: Brand): string {
  switch (brand) {
    case 'startribune':
      return `${PACKAGE_NAME}/dist/fonts/startribune.css`;
    case 'varsity':
      return `${PACKAGE_NAME}/dist/fonts/varsity.css`;
    default:
      return '';
  }
}

/**
 * Relative path from the built script to the font file (for runtime link href).
 * Used internally by loadBrandFonts so the link resolves when the script is loaded.
 */
function getBrandFontRelativePath(brand: Brand): string {
  switch (brand) {
    case 'startribune':
      return './fonts/startribune.css';
    case 'varsity':
      return './fonts/varsity.css';
    default:
      return '';
  }
}

const LINK_ID_PREFIX = 'design-system-fonts-';

/**
 * Loads brand-specific fonts by injecting a link element.
 * Idempotent: safe to call multiple times for the same brand; skips if already loaded.
 * In production the brand is set once; in Storybook the brand may change dynamically.
 */
export function loadBrandFonts(brand: Brand): void {
  const relativePath = getBrandFontRelativePath(brand);
  if (!relativePath) return;

  const linkId = `${LINK_ID_PREFIX}${brand}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = new URL(relativePath, import.meta.url).href;
  document.head.appendChild(link);
}

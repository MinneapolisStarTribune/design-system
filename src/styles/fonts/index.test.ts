import { describe, it, expect, afterEach } from 'vitest';
import { getBrandFontPath, loadBrandFonts } from './index';

const PACKAGE_NAME = '@minneapolisstartribune/design-system';

describe('getBrandFontPath', () => {
  it('returns package path for startribune', () => {
    expect(getBrandFontPath('startribune')).toBe(
      `${PACKAGE_NAME}/dist/fonts/font-face/startribune.css`
    );
  });

  it('returns package path for varsity', () => {
    expect(getBrandFontPath('varsity')).toBe(`${PACKAGE_NAME}/dist/fonts/font-face/varsity.css`);
  });
});

describe('loadBrandFonts', () => {
  afterEach(() => {
    ['design-system-fonts-startribune', 'design-system-fonts-varsity'].forEach((id) =>
      document.getElementById(id)?.remove()
    );
  });

  it('injects a link with correct id, rel, and href for startribune', () => {
    loadBrandFonts('startribune');
    const link = document.getElementById('design-system-fonts-startribune');
    expect(link).toBeInstanceOf(HTMLLinkElement);
    expect((link as HTMLLinkElement).rel).toBe('stylesheet');
    expect((link as HTMLLinkElement).href).toContain('startribune.css');
  });

  it('injects a link with correct id, rel, and href for varsity', () => {
    loadBrandFonts('varsity');
    const link = document.getElementById('design-system-fonts-varsity');
    expect(link).toBeInstanceOf(HTMLLinkElement);
    expect((link as HTMLLinkElement).rel).toBe('stylesheet');
    expect((link as HTMLLinkElement).href).toContain('varsity.css');
  });

  it('does not add a duplicate link when called again for the same brand', () => {
    loadBrandFonts('startribune');
    const linksBefore = document.querySelectorAll('#design-system-fonts-startribune').length;
    loadBrandFonts('startribune');
    const linksAfter = document.querySelectorAll('#design-system-fonts-startribune').length;
    expect(linksAfter).toBe(linksBefore);
    expect(linksAfter).toBe(1);
  });

  it('adds a second link when switching to another brand', () => {
    loadBrandFonts('startribune');
    loadBrandFonts('varsity');
    expect(document.getElementById('design-system-fonts-startribune')).toBeTruthy();
    expect(document.getElementById('design-system-fonts-varsity')).toBeTruthy();
  });
});

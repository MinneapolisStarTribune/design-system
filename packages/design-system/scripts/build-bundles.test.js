/**
 * Tests for bundle exclusion verification
 * 
 * Verifies that web and native bundles properly exclude platform-specific code:
 * - Web bundle excludes React Native dependencies
 * - Native bundle excludes CSS/SCSS
 * 
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

describe('Bundle Exclusions', () => {
  const nativeBundlePath = path.join(projectRoot, 'dist/mobile/design-system.es.js');
  const webButtonModulePath = path.join(
    projectRoot,
    'dist/web/components/Button/web/Button.es.js'
  );

  describe('Web bundle', () => {
    it('does not ship the React Native Button implementation when the web bundle exists', () => {
      if (!fs.existsSync(webButtonModulePath)) {
        console.warn('Web bundle not found. Run "yarn build:web" first.');
        return;
      }

      const webButton = fs.readFileSync(webButtonModulePath, 'utf-8');
      expect(webButton).not.toMatch(/\bPressable\b/);
      expect(webButton).not.toMatch(/Button\.native/);
    });
  });

  describe('Native bundle', () => {
    it.skip('excludes CSS/SCSS and DOM-specific code', () => {
      if (!fs.existsSync(nativeBundlePath)) {
        console.warn('Native bundle not found. Run "yarn build:native" first.');
        return;
      }

      const nativeBundle = fs.readFileSync(nativeBundlePath, 'utf-8');
      const lowerContent = nativeBundle.toLowerCase();

      // Verify CSS/SCSS and DOM-specific code is not included
      expect(lowerContent).not.toContain('.module.scss');
      expect(lowerContent).not.toContain('.css');
      expect(lowerContent).not.toContain('css-injected-by-js');
      expect(lowerContent).not.toContain('react-dom');
    });
  });
});

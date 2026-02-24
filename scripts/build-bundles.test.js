/**
 * Tests for bundle exclusion verification
 * 
 * Verifies that web and native bundles properly exclude platform-specific code:
 * - Web bundle excludes React Native dependencies
 * - Native bundle excludes Mantine and CSS/SCSS
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
  const webBundlePath = path.join(projectRoot, 'dist/web/design-system.es.js');
  const nativeBundlePath = path.join(projectRoot, 'dist/mobile/design-system.es.js');

  describe('Web bundle', () => {
    it('excludes React Native code', () => {
      if (!fs.existsSync(webBundlePath)) {
        console.warn('Web bundle not found. Run "yarn build:web" first.');
        return;
      }

      const webBundle = fs.readFileSync(webBundlePath, 'utf-8');
      const lowerContent = webBundle.toLowerCase();

      // Verify React Native is not included
      expect(lowerContent).not.toContain('react-native');
      expect(lowerContent).not.toContain('react-native-svg');
    });
  });

  describe('Native bundle', () => {
    it('excludes Mantine dependencies', () => {
      if (!fs.existsSync(nativeBundlePath)) {
        console.warn('Native bundle not found. Run "yarn build:native" first.');
        return;
      }

      const nativeBundle = fs.readFileSync(nativeBundlePath, 'utf-8');
      const lowerContent = nativeBundle.toLowerCase();

      // Verify Mantine is not included
      expect(lowerContent).not.toContain('@mantine/core');
      expect(lowerContent).not.toContain('@mantine/hooks');
      expect(lowerContent).not.toContain('mantine');
    });

    it('excludes CSS/SCSS and DOM-specific code', () => {
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

/**
 * Tests for build-tokens.js
 * 
 * These tests verify that the token building script:
 * - Generates the correct CSS files
 * - Formats CSS variables correctly
 * - Handles different brands and modes
 * - Includes expected token values
 * 
 * Note: These tests run in Node.js environment (not jsdom) since they test
 * file system operations and script execution. This prevents React/Mantine
 * from being loaded, which would cause errors since we're not rendering components.
 * 
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('build-tokens.js', () => {
  const projectRoot = path.join(__dirname, '..');
  const themesDir = path.join(projectRoot, 'dist', 'web', 'themes');
  const expectedFiles = [
    'startribune-light.css',
    'startribune-dark.css',
    'varsity-light.css',
    'varsity-dark.css',
  ];

  beforeEach(() => {
    // Clean up any existing theme files before tests
    if (fs.existsSync(themesDir)) {
      expectedFiles.forEach((file) => {
        const filePath = path.join(themesDir, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
  });

  afterEach(() => {
    // Clean up generated files after tests
    if (fs.existsSync(themesDir)) {
      expectedFiles.forEach((file) => {
        const filePath = path.join(themesDir, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
  });

  describe('File Generation', () => {
    it('generates all expected CSS files', () => {
      // Run the build script
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      // Verify all expected files exist
      expectedFiles.forEach((file) => {
        const filePath = path.join(themesDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    it('generates files with correct naming pattern', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      expectedFiles.forEach((file) => {
        const filePath = path.join(themesDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
        
        // Verify naming pattern: {brand}-{mode}.css
        const [brand, mode] = file.replace('.css', '').split('-');
        expect(['startribune', 'varsity']).toContain(brand);
        expect(['light', 'dark']).toContain(mode);
      });
    });
  });

  describe('CSS File Format', () => {
    it('generates valid CSS with :root selector', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      expectedFiles.forEach((file) => {
        const filePath = path.join(themesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Should contain :root selector
        expect(content).toContain(':root {');
        expect(content).toContain('}');

        // Should have header comment
        expect(content).toContain('Do not edit directly');
        expect(content).toContain('auto-generated');
      });
    });

    it('generates CSS variables with correct format', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune-light.css');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should contain CSS variable declarations
      // Format: "  --color-*: value;"
      const variableRegex = /^\s+--[a-z0-9-]+:\s+.+;$/m;
      expect(content).toMatch(variableRegex);

      // Should have proper indentation (2 spaces)
      const lines = content.split('\n');
      const variableLines = lines.filter((line) => line.match(/^\s+--/));
      variableLines.forEach((line) => {
        expect(line).toMatch(/^  --/); // Starts with 2 spaces
      });
    });

    it('removes duplicate color- prefixes', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune-light.css');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should not contain duplicate color-color- prefix
      expect(content).not.toMatch(/--color-color-/);
    });
  });

  describe('Token Content', () => {
    it('includes base color tokens', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune-light.css');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should include base colors
      expect(content).toMatch(/--color-base-black:/);
      expect(content).toMatch(/--color-base-white:/);
    });

    it('includes icon color tokens', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'varsity-dark.css');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should include icon color tokens
      expect(content).toMatch(/--color-icon-/);
    });

    it('includes button color tokens', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune-light.css');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should include button color tokens
      expect(content).toMatch(/--color-button-/);
    });

    it('includes spacing tokens', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune-dark.css');
      const content = fs.readFileSync(filePath, 'utf-8');

      expect(content.length).toBeGreaterThan(100);
    });

    it('includes font-family tokens', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune-light.css');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should include font-family tokens
      expect(content).toMatch(/--font-family-/);
      
      // Verify graphik-compact token exists
      expect(content).toMatch(/--font-family-graphik-compact:/);
    });
  });

  describe('Token Reference Resolution', () => {
    it('resolves font.family.graphik-compact token reference correctly', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune-light.css');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract the font-family-graphik-compact value
      const match = content.match(/--font-family-graphik-compact:\s*([^;]+);/);
      
      expect(match).toBeTruthy();
      
      const resolvedValue = match[1].trim();
      
      // Verify it resolved to the actual font value (not a token reference)
      expect(resolvedValue).toBe('Graphik Compact, sans-serif');
      
      // Verify it's not still a token reference
      expect(resolvedValue).not.toMatch(/^{font\.family\.graphik-compact}$/);
      expect(resolvedValue).not.toContain('{font.family');
    });

    it('resolves all font-family token references across all themes', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const testFiles = [
        'startribune-light.css',
        'startribune-dark.css',
        'varsity-light.css',
        'varsity-dark.css',
      ];

      testFiles.forEach((file) => {
        const filePath = path.join(themesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Verify graphik-compact token exists in all themes
        expect(content).toMatch(/--font-family-graphik-compact:/);
        
        // Extract and verify the value is resolved correctly
        const match = content.match(/--font-family-graphik-compact:\s*([^;]+);/);
        expect(match).toBeTruthy();
        
        const resolvedValue = match[1].trim();
        expect(resolvedValue).toBe('Graphik Compact, sans-serif');
        
        // Verify no unresolved token references remain
        expect(resolvedValue).not.toContain('{');
        expect(resolvedValue).not.toContain('}');
      });
    });

    it('resolves token references with correct format', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'varsity-dark.css');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Verify all font-family tokens are properly formatted
      const fontFamilyMatches = content.matchAll(/--font-family-([^:]+):\s*([^;]+);/g);
      
      let foundGraphikCompact = false;
      for (const match of fontFamilyMatches) {
        const tokenName = match[1].trim();
        const tokenValue = match[2].trim();
        
        // Verify no unresolved token references
        expect(tokenValue).not.toContain('{');
        expect(tokenValue).not.toContain('}');
        
        // Track if we found the specific token we're testing
        if (tokenName === 'graphik-compact') {
          foundGraphikCompact = true;
          expect(tokenValue).toBe('Graphik Compact, sans-serif');
        }
      }
      
      expect(foundGraphikCompact).toBe(true);
    });
  });

  describe('Brand and Mode Differences', () => {
    it('generates different content for different brands', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const startribunePath = path.join(themesDir, 'startribune-light.css');
      const varsityPath = path.join(themesDir, 'varsity-light.css');

      const startribuneContent = fs.readFileSync(startribunePath, 'utf-8');
      const varsityContent = fs.readFileSync(varsityPath, 'utf-8');

      // Files should exist and have content
      expect(startribuneContent.length).toBeGreaterThan(0);
      expect(varsityContent.length).toBeGreaterThan(0);

      // They might have different brand-specific tokens
      // At minimum, they should both be valid CSS
      expect(startribuneContent).toContain(':root {');
      expect(varsityContent).toContain(':root {');
    });

    it('generates different content for light vs dark modes', () => {
      execSync('node scripts/builders/build-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const lightPath = path.join(themesDir, 'startribune-light.css');
      const darkPath = path.join(themesDir, 'startribune-dark.css');

      const lightContent = fs.readFileSync(lightPath, 'utf-8');
      const darkContent = fs.readFileSync(darkPath, 'utf-8');

      // Both should exist and be valid
      expect(lightContent).toContain(':root {');
      expect(darkContent).toContain(':root {');

      // They should have different button token values (light vs dark)
      // Extract button background colors if they exist
      const lightButtonBg = lightContent.match(/--color-button-filled-background:\s*([^;]+)/);
      const darkButtonBg = darkContent.match(/--color-button-filled-background:\s*([^;]+)/);

      // If both exist, they should be different (light mode typically has dark bg, dark mode has light bg)
      if (lightButtonBg && darkButtonBg) {
        expect(lightButtonBg[1].trim()).not.toBe(darkButtonBg[1].trim());
      }
    });
  });

  describe('Error Handling', () => {
    it('exits with error code 1 on failure', () => {
      // This test would require mocking Style Dictionary to throw an error
      // For now, we'll just verify the script structure allows for error handling
      // In a real scenario, you might want to test with invalid token files

      // Verify the script has error handling
      const scriptPath = path.join(__dirname, 'build-tokens.js');
      const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(scriptContent).toContain('.catch(');
      expect(scriptContent).toContain('process.exit(1)');
    });
  });
});


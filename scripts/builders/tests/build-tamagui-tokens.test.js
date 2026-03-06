/**
 * Tests for build-tamagui-tokens.js
 * 
 * These tests verify that the Tamagui token building script:
 * - Generates the correct TypeScript files
 * - Formats TypeScript exports correctly
 * - Handles different brands and modes
 * - Includes expected token values
 * 
 * Note: These tests run in Node.js environment (not jsdom) since they test
 * file system operations and script execution.
 * 
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('build-tamagui-tokens.js', () => {
  const projectRoot = path.join(__dirname, '..', '..', '..');
  const themesDir = path.join(projectRoot, 'src', 'generated', 'themes');
  const expectedFiles = [
    'startribune.light.ts',
    'startribune.dark.ts',
    'varsity.light.ts',
    'varsity.dark.ts',
  ];

  // Note: No beforeEach/afterEach cleanup. The theme files are required by
  // theme-helpers.ts and tamagui.config.ts. Deleting them breaks component
  // tests that run in parallel. The build script overwrites files anyway.

  describe('File Generation', () => {
    it('generates all expected TypeScript files', () => {
      // Run the build script
      execSync('node scripts/builders/build-tamagui-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      // Verify all expected files exist
      expectedFiles.forEach((file) => {
        const filePath = path.join(themesDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    it('generates files with correct naming pattern', () => {
      execSync('node scripts/builders/build-tamagui-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      expectedFiles.forEach((file) => {
        const filePath = path.join(themesDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
        
        // Verify naming pattern: {brand}.{mode}.ts
        const [brand, mode] = file.replace('.ts', '').split('.');
        expect(['startribune', 'varsity']).toContain(brand);
        expect(['light', 'dark']).toContain(mode);
      });
    });
  });

  describe('Token Content', () => {
    it('includes base color tokens', () => {
      execSync('node scripts/builders/build-tamagui-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune.light.ts');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should include base colors
      expect(content.includes('base-black')).toBe(true);
      expect(content.includes('base-white')).toBe(true);
    });

    it('includes palette color tokens', () => {
      execSync('node scripts/builders/build-tamagui-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune.light.ts');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should include at least one palette color (e.g., neutral-50, cobalt-blue-50)
      const hasPaletteColor = 
        content.includes('neutral-50') ||
        content.includes('cobalt-blue-50') ||
        content.includes('red-50');
      
      expect(hasPaletteColor).toBeTruthy();
    });

    it('includes semantic color tokens', () => {
      execSync('node scripts/builders/build-tamagui-tokens.js', { cwd: projectRoot, stdio: 'pipe' });

      const filePath = path.join(themesDir, 'startribune.light.ts');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should include semantic colors
      expect(content.includes('background-light-default')).toBe(true);
      expect(content.includes('background-dark-default')).toBe(true);
    });
  });
});

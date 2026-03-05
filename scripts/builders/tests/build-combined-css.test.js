/**
 * Tests for build-combined-css.js
 *
 * These tests verify that the combined CSS build script:
 * - Combines typography and theme CSS files correctly
 * - Handles missing files gracefully
 * - Outputs to correct location (dist/web/{brand}-{mode}.css)
 * - Includes both CSS variables and typography classes
 *
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import buildCombinedCSS from '../build-combined-css.js';

describe('buildCombinedCSS', () => {
  let existsSyncSpy;
  let readFileSyncSpy;
  let writeFileSyncSpy;
  let logSpy;

  beforeEach(() => {
    existsSyncSpy = vi.spyOn(fs, 'existsSync');
    readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('combines typography and theme CSS files', async () => {
    const brand = 'startribune';
    const mode = 'light';
    const fontsCSS = '.typography-editorial-news-h1 { font-size: 2rem; }';
    const themesCSS = ':root { --color-base-black: #000000; }';

    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockImplementation((filePath) => {
      if (filePath.includes('fonts/startribune-light.css')) {
        return fontsCSS;
      }
      if (filePath.includes('themes/startribune-light.css')) {
        return themesCSS;
      }
      return '';
    });

    await buildCombinedCSS(brand, mode);

    expect(writeFileSyncSpy).toHaveBeenCalled();
    const outputPath = writeFileSyncSpy.mock.calls[0][0];
    const outputContent = writeFileSyncSpy.mock.calls[0][1];

    expect(outputPath).toContain('dist/web/startribune-light.css');
    expect(outputContent).toContain(fontsCSS);
    expect(outputContent).toContain(themesCSS);
    expect(outputContent).toContain('CSS Variables (Theme)');
    expect(outputContent).toContain('Typography Classes');
  });

  it('handles missing typography file gracefully', async () => {
    const brand = 'startribune';
    const mode = 'light';
    const themesCSS = ':root { --color-base-black: #000000; }';

    existsSyncSpy.mockImplementation((filePath) => {
      if (filePath.includes('fonts/startribune-light.css')) {
        return false;
      }
      if (filePath.includes('themes/startribune-light.css')) {
        return true;
      }
      return false;
    });
    readFileSyncSpy.mockReturnValue(themesCSS);

    await buildCombinedCSS(brand, mode);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Typography file not found')
    );
    expect(writeFileSyncSpy).toHaveBeenCalled();
    const outputContent = writeFileSyncSpy.mock.calls[0][1];
    expect(outputContent).toContain(themesCSS);
    expect(outputContent).not.toContain('Typography Classes');
  });

  it('skips build when both files are missing', async () => {
    const brand = 'nonexistent';
    const mode = 'light';

    existsSyncSpy.mockReturnValue(false);

    await buildCombinedCSS(brand, mode);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('No source files found')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('skipping combined CSS build')
    );
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });
});

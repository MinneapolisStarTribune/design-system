import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'node:os';
import path from 'node:path';
import StyleDictionary from 'style-dictionary';
import buildThemeTokens from '../build-theme-tokens.js';
import getStyleDictionaryConfig, { toReactNativeRgba } from '../get-style-dictionary-config.js';

vi.mock('../../formats/css-variables', () => ({
  default: vi.fn(),
}));

describe('buildThemeTokens', () => {
  let existsSyncSpy;
  let logSpy;

  beforeEach(() => {
    existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds theme tokens for a given brand and mode', async () => {
    const brand = 'startribune';
    const mode = 'light';

    await buildThemeTokens(brand, mode);

    expect(existsSyncSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('startribune-light tokens built (CSS, JS)'));
  });

  it('logs processing message before building', async () => {
    await buildThemeTokens('startribune', 'light');

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Processing: startribune-light'));
  });

  it('builds tokens for different brand and mode combinations', async () => {
    await buildThemeTokens('varsity', 'dark');

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('varsity-dark tokens built (CSS, JS)'));
  });

  it('applies the RN color transform in the built theme output', async () => {
    existsSyncSpy.mockRestore();
    const packageRoot = path.join(import.meta.dirname, '../../..');
    // Token sources resolve against process.cwd(), which is not the package
    // root inside vitest workers — point cwd at the package root and build
    // the real pipeline into a temp dir.
    vi.spyOn(process, 'cwd').mockReturnValue(packageRoot);
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-theme-tokens-'));

    try {
      const config = getStyleDictionaryConfig('startribune', 'light');
      config.platforms.javascript.buildPath = `${outputDir}/`;
      delete config.platforms.css;

      const sd = new StyleDictionary(config);
      await sd.buildAllPlatforms();

      const built = fs.readFileSync(path.join(outputDir, 'startribune-light.js'), 'utf8');
      const colors = built.match(/rgba?\([^)]*\)/g);

      expect(built).toContain('colorOverlayBlack');
      expect(colors.length).toBeGreaterThan(0);
      // Every emitted color must be a fixed point of the transform — i.e.
      // already converted to a form React Native can parse.
      const unconverted = colors.filter((color) => toReactNativeRgba(color) !== color);
      expect(unconverted).toEqual([]);
    } finally {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });

  it('indicates both CSS and JavaScript outputs in success message', async () => {
    await buildThemeTokens('startribune', 'light');

    // Verify the success message mentions both CSS and JS
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('tokens built (CSS, JS)'));
  });

});

describe('toReactNativeRgba', () => {
  it('converts slash syntax with percent alpha', () => {
    expect(toReactNativeRgba('rgb(0 0 0 / 30%)')).toBe('rgba(0, 0, 0, 0.3)');
    expect(toReactNativeRgba('rgb(72 160 255 / 16%)')).toBe('rgba(72, 160, 255, 0.16)');
    expect(toReactNativeRgba('rgb(255 255 255 / 0%)')).toBe('rgba(255, 255, 255, 0)');
  });

  it('converts 4-value space-separated rgb()', () => {
    expect(toReactNativeRgba('rgb(0 0 0 0)')).toBe('rgba(0, 0, 0, 0)');
    expect(toReactNativeRgba('rgb(0 0 0 0.5)')).toBe('rgba(0, 0, 0, 0.5)');
  });

  it('converts 4-argument comma-separated rgb()', () => {
    expect(toReactNativeRgba('rgb(0, 0, 0, 0)')).toBe('rgba(0, 0, 0, 0)');
  });

  it('passes through values React Native already parses', () => {
    expect(toReactNativeRgba('#ffffff')).toBe('#ffffff');
    expect(toReactNativeRgba('rgba(0, 0, 0, 0.5)')).toBe('rgba(0, 0, 0, 0.5)');
    expect(toReactNativeRgba('rgb(0, 0, 0)')).toBe('rgb(0, 0, 0)');
    expect(toReactNativeRgba(undefined)).toBe(undefined);
  });
});

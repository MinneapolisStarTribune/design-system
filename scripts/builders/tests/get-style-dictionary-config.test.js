import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import getStyleDictionaryConfig from '../get-style-dictionary-config.js';

describe('getStyleDictionaryConfig', () => {
  let existsSyncSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    existsSyncSpy = vi.spyOn(fs, 'existsSync');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generates valid config with all files present', () => {
    existsSyncSpy.mockReturnValue(true);

    const customFormats = {
      cssVariables: vi.fn(),
      typographyClasses: vi.fn(),
    };

    const config = getStyleDictionaryConfig('startribune', 'light', customFormats);

    // Verify config structure
    expect(config.log.verbosity).toBe('verbose');
    expect(config.platforms.css.transformGroup).toBe('css');
    expect(config.platforms.css.buildPath).toBe('dist/themes/');
    expect(config.platforms.css.files[0].destination).toBe('startribune-light.css');
    expect(config.platforms.javascript.buildPath).toBe('dist/mobile/');
    expect(config.platforms.javascript.files[0].destination).toBe('startribune-light.js');

    // Verify source files
    expect(config.source).toHaveLength(7);
    expect(config.source).toContain('tokens/color/global.json');
    expect(config.source).toContain('tokens/color/button-light.json');
    expect(config.source).toContain('tokens/color/brand-startribune-light.json');

    // Verify custom formats
    expect(config.hooks.formats['css/variables']).toBe(customFormats.cssVariables);
    expect(config.hooks.formats['css/typography-classes']).toBe(customFormats.typographyClasses);
  });

  it('generates correct config for different brand and mode combinations', () => {
    existsSyncSpy.mockReturnValue(true);

    const config = getStyleDictionaryConfig('varsity', 'dark');

    expect(config.source).toContain('tokens/color/button-dark.json');
    expect(config.source).toContain('tokens/color/brand-varsity-dark.json');
    expect(config.platforms.css.files[0].destination).toBe('varsity-dark.css');
  });

  it('throws error when required files are missing', () => {
    existsSyncSpy.mockImplementation((filePath) => {
      return !filePath.includes('global.json');
    });

    expect(() => {
      getStyleDictionaryConfig('startribune', 'light');
    }).toThrow('Missing required token file');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Required token file not found')
    );
  });

  it('handles optional formats parameter', () => {
    existsSyncSpy.mockReturnValue(true);

    const configWithoutFormats = getStyleDictionaryConfig('startribune', 'light');
    expect(configWithoutFormats.hooks.formats).toEqual({});

    const configWithEmptyFormats = getStyleDictionaryConfig('startribune', 'light', {});
    expect(configWithEmptyFormats.hooks.formats).toEqual({});
  });
});

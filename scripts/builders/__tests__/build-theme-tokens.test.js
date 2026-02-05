import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import buildThemeTokens from '../build-theme-tokens.js';

vi.mock('../../formats/css-variables', () => ({
  default: vi.fn(),
}));

describe('buildThemeTokens', () => {
  beforeEach(() => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds theme tokens for a given brand and mode', async () => {
    const brand = 'startribune';
    const mode = 'light';

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await buildThemeTokens(brand, mode);

    expect(fs.existsSync).toHaveBeenCalled();
    
    expect(logSpy).toHaveBeenCalled();

    logSpy.mockRestore();
  });
});

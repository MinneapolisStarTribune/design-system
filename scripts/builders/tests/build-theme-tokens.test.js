import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import buildThemeTokens from '../build-theme-tokens.js';

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

  it('indicates both CSS and JavaScript outputs in success message', async () => {
    await buildThemeTokens('startribune', 'light');

    // Verify the success message mentions both CSS and JS
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('tokens built (CSS, JS)'));
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import buildTypographyClasses from '../build-typography-classes.js';

vi.mock('../../formats/typography-classes', () => ({
  default: vi.fn(),
}));

describe('buildTypographyClasses', () => {
  let existsSyncSpy;
  let logSpy;

  beforeEach(() => {
    existsSyncSpy = vi.spyOn(fs, 'existsSync');
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds typography classes for a given brand', async () => {
    existsSyncSpy.mockReturnValue(true);
    const brand = 'startribune';

    await buildTypographyClasses(brand);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });

  it('returns early when editorial typography file does not exist', async () => {
    const brand = 'nonexistent';
    
    // Return false only for the editorial file path check
    existsSyncSpy.mockReturnValue(false);

    await buildTypographyClasses(brand);

    // Should log the initial message and the warning
    expect(logSpy).toHaveBeenCalledWith(`
Building editorial typography classes for ${brand}...`);
    expect(logSpy).toHaveBeenCalledWith(`⚠️  No editorial typography file found for ${brand}, skipping...`);
    
    // Should NOT log the success message
    expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('typography classes built'));
  });

  it('filters out non-existent source files', async () => {
    const brand = 'startribune';
    
    // Mock to return true for editorial file check, but false for some source files
    existsSyncSpy.mockImplementation((filePath) => {
      // Editorial file exists (first check at line 25)
      if (filePath.includes('editorial') && filePath.includes(brand)) {
        return true;
      }
      // tokens/text.json doesn't exist (filtered at line 31-34)
      if (filePath.includes('text.json')) {
        return false;
      }
      // Other files exist
      return true;
    });

    await buildTypographyClasses(brand);

    // Should still build successfully with remaining files
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('typography classes built'));
  });
});

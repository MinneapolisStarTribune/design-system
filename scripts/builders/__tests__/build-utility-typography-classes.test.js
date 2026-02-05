import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import buildUtilityTypographyClasses from '../build-utility-typography-classes.js';

vi.mock('../../formats/typography-classes', () => ({
  default: vi.fn(),
}));

describe('buildUtilityTypographyClasses', () => {
  let existsSyncSpy;
  let logSpy;

  beforeEach(() => {
    existsSyncSpy = vi.spyOn(fs, 'existsSync');
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds utility typography classes for a given brand', async () => {
    existsSyncSpy.mockReturnValue(true);
    const brand = 'startribune';

    await buildUtilityTypographyClasses(brand);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });

  it('returns early when shared utility typography file does not exist', async () => {
    const brand = 'startribune';
    
    // Return false for the shared file path check
    existsSyncSpy.mockReturnValue(false);

    await buildUtilityTypographyClasses(brand);

    // Should log the initial message and the warning
    expect(logSpy).toHaveBeenCalledWith(`
Building utility typography classes for ${brand}...`);
    expect(logSpy).toHaveBeenCalledWith(`⚠️  No shared utility typography found, skipping utility build for ${brand}...`);
    
    // Should NOT log the success message
    expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('typography classes built'));
  });

  it('filters out non-existent source files', async () => {
    const brand = 'varsity';
    
    // Mock to return true for shared file check, but false for brand-specific file
    existsSyncSpy.mockImplementation((filePath) => {
      // Shared file exists (first check at line 29)
      if (filePath.includes('utility/shared.json')) {
        return true;
      }
      // Brand-specific file doesn't exist (filtered at line 34-37)
      if (filePath.includes(`utility/${brand}.json`)) {
        return false;
      }
      // Other files exist
      return true;
    });

    await buildUtilityTypographyClasses(brand);

    // Should still build successfully with shared file
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('typography classes built'));
  });
});

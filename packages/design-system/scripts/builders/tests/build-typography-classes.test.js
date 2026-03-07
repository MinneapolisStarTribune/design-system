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

  it('builds combined typography classes for a given brand', async () => {
    existsSyncSpy.mockReturnValue(true);
    const brand = 'startribune';

    await buildTypographyClasses(brand);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Building typography classes (editorial + utility)')
    );
  });

  it('skips build when both editorial and utility files are missing', async () => {
    const brand = 'nonexistent';

    existsSyncSpy.mockImplementation((filePath) => {
      // Neither editorial nor utility files exist
      if (filePath.includes('editorial') || filePath.includes('utility')) {
        return false;
      }
      // text.json exists
      return true;
    });

    await buildTypographyClasses(brand);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('No typography files found')
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('skipping')
    );
    // Should NOT log success message
    expect(logSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('typography classes built')
    );
  });

  it('filters out non-existent source files', async () => {
    const brand = 'startribune';

    existsSyncSpy.mockImplementation((filePath) => {
      // Editorial file exists
      if (filePath.includes('editorial') && filePath.includes(brand)) {
        return true;
      }
      // Utility shared file exists
      if (filePath.includes('utility/shared.json')) {
        return true;
      }
      // text.json doesn't exist (should be filtered)
      if (filePath.includes('text.json')) {
        return false;
      }
      // Other files exist
      return true;
    });

    await buildTypographyClasses(brand);

    // Should still build successfully with remaining files
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('typography classes built')
    );
  });
});

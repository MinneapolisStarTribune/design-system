import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import buildMobileFonts from '../build-mobile-fonts.js';

describe('buildMobileFonts', () => {
  let existsSyncSpy;
  let readFileSyncSpy;
  let writeFileSyncSpy;
  let mkdirSyncSpy;
  let logSpy;

  beforeEach(() => {
    existsSyncSpy = vi.spyOn(fs, 'existsSync');
    readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    mkdirSyncSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generates mobile font tokens for valid font tokens', async () => {
    const brand = 'startribune';
    const tokenData = {
      font: {
        brand: {
          startribune: {
            fonts: [
              {
                name: 'Publico Text',
                family: 'Publico Text, serif',
                url: 'https://fonts.startribune.com/PublicoTextWebFonts/',
                variants: [
                  {
                    weight: 400,
                    style: 'normal',
                    file: 'PublicoText-Roman-Web.woff2',
                  },
                ],
              },
            ],
          },
        },
      },
    };

    existsSyncSpy.mockImplementation((filePath) => {
      if (filePath.includes('tokens/fonts/startribune.json')) return true;
      if (filePath.includes('dist/mobile')) return false;
      return false;
    });
    readFileSyncSpy.mockReturnValue(JSON.stringify(tokenData));

    await buildMobileFonts(brand);

    expect(mkdirSyncSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);

    const jsContent = writeFileSyncSpy.mock.calls[0][1];
    
    expect(jsContent).toContain('export default');
    expect(jsContent).toContain('"name": "Publico Text"');
    expect(jsContent).toContain('"url": "https://fonts.startribune.com/PublicoTextWebFonts/PublicoText-Roman-Web.woff2"');
  });

  it("skips generation when token file doesn't exist", async () => {
    existsSyncSpy.mockReturnValue(false);

    await buildMobileFonts('nonexistentbrand');

    expect(logSpy).toHaveBeenCalledWith(
      '⚠️  No font tokens found for nonexistentbrand, skipping mobile font build...'
    );
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });

  it('skips generation when fonts array is missing', async () => {
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(JSON.stringify({ font: { brand: { startribune: {} } } }));

    await buildMobileFonts('startribune');

    expect(logSpy).toHaveBeenCalledWith(
      '⚠️  No fonts array in tokens/fonts/startribune.json, skipping...'
    );
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });

  it('handles variants with missing weight/style defaults', async () => {
    const tokenData = {
      font: {
        brand: {
          startribune: {
            fonts: [{
              name: 'Test Font',
              url: 'https://fonts.test.com/',
              variants: [{ file: 'test.woff2' }],
            }],
          },
        },
      },
    };

    existsSyncSpy.mockImplementation((filePath) => {
      if (filePath.includes('tokens/fonts/startribune.json')) return true;
      return false;
    });
    readFileSyncSpy.mockReturnValue(JSON.stringify(tokenData));

    await buildMobileFonts('startribune');

    const jsContent = writeFileSyncSpy.mock.calls[0][1];
    
    expect(jsContent).toContain('"weight": 400');
    expect(jsContent).toContain('"style": "normal"');
  });
});

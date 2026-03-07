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

  it('generates mobile font tokens with RN-friendly format', async () => {
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
      if (filePath.includes('dist/mobile/fonts')) return false;
      return false;
    });
    readFileSyncSpy.mockReturnValue(JSON.stringify(tokenData));

    await buildMobileFonts(brand);

    expect(mkdirSyncSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);

    const jsContent = writeFileSyncSpy.mock.calls[0][1];

    // Uses module.exports, not export default
    expect(jsContent).toContain('module.exports');
    expect(jsContent).not.toContain('export default');

    // Uses bare font name, not CSS family stack
    expect(jsContent).toContain('"fontFamily": "Publico Text"');
    expect(jsContent).not.toContain('serif');

    // File stem without extension
    expect(jsContent).toContain('"file": "PublicoText-Roman-Web"');
    expect(jsContent).not.toContain('.woff2');

    // No web URLs
    expect(jsContent).not.toContain('https://');

    // Keyed by camelCase font name
    expect(jsContent).toContain('"publicoText"');
  });

  it('generates camelCase keys for multi-word font names', async () => {
    const tokenData = {
      font: {
        brand: {
          varsity: {
            fonts: [
              {
                name: 'Graphik Condensed',
                url: 'https://fonts.test.com/',
                variants: [{ weight: 400, style: 'normal', file: 'GraphikCondensed-Regular.woff2' }],
              },
            ],
          },
        },
      },
    };

    existsSyncSpy.mockImplementation((filePath) => {
      if (filePath.includes('tokens/fonts/varsity.json')) return true;
      return false;
    });
    readFileSyncSpy.mockReturnValue(JSON.stringify(tokenData));

    await buildMobileFonts('varsity');

    const jsContent = writeFileSyncSpy.mock.calls[0][1];
    expect(jsContent).toContain('"graphikCondensed"');
    expect(jsContent).toContain('"fontFamily": "Graphik Condensed"');
  });

  it("skips generation when token file doesn't exist", async () => {
    existsSyncSpy.mockReturnValue(false);

    await buildMobileFonts('nonexistentbrand');

    expect(logSpy).toHaveBeenCalledWith(
      '⚠️  No font tokens found for nonexistentbrand, skipping mobile font build...',
    );
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });

  it('skips generation when fonts array is missing', async () => {
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(JSON.stringify({ font: { brand: { startribune: {} } } }));

    await buildMobileFonts('startribune');

    expect(logSpy).toHaveBeenCalledWith(
      '⚠️  No fonts array in tokens/fonts/startribune.json, skipping...',
    );
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });

  it('handles variants with missing weight/style defaults', async () => {
    const tokenData = {
      font: {
        brand: {
          startribune: {
            fonts: [
              {
                name: 'Test Font',
                url: 'https://fonts.test.com/',
                variants: [{ file: 'test.woff2' }],
              },
            ],
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

    // Defaults applied
    expect(jsContent).toContain('"weight": 400');
    expect(jsContent).toContain('"style": "normal"');
    // Extension stripped
    expect(jsContent).toContain('"file": "test"');
    expect(jsContent).not.toContain('.woff2');
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import buildFontFaces from '../build-font-faces.js';

describe('buildFontFaces', () => {
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

  it('generates @font-face CSS for valid font tokens', async () => {
    const brand = 'startribune';
    const tokenData = {
      font: {
        brand: {
          startribune: {
            fonts: [
              {
                name: 'Graphik',
                family: 'Graphik',
                url: '/fonts/graphik',
                variants: [
                  {
                    weight: 400,
                    style: 'normal',
                    file: 'graphik-regular.woff2',
                  },
                  {
                    weight: 600,
                    style: 'italic',
                    file: 'graphik-semibold-italic.woff2',
                  },
                ],
              },
            ],
          },
        },
      },
    };

    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(JSON.stringify(tokenData));

    await buildFontFaces(brand);

    expect(writeFileSyncSpy).toHaveBeenCalled();
    const cssOutput = writeFileSyncSpy.mock.calls[0][1];

    expect(cssOutput).toContain('@font-face');
    expect(cssOutput).toContain("font-family: 'Graphik';");
    expect(cssOutput).toContain("src: url('/fonts/graphik/graphik-regular.woff2')");
    expect(cssOutput).toContain('font-weight: 400;');
    expect(cssOutput).toContain('font-style: normal;');
    expect(cssOutput).toContain("src: url('/fonts/graphik/graphik-semibold-italic.woff2')");
    expect(cssOutput).toContain('font-weight: 600;');
    expect(cssOutput).toContain('font-style: italic;');
  });

  it("skips generation when token file doesn't exist", async () => {
    existsSyncSpy.mockReturnValue(false);

    await buildFontFaces('nonexistentbrand');

    expect(logSpy).toHaveBeenCalledWith(
      '⚠️  No font tokens found for nonexistentbrand, skipping @font-face build...'
    );
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });

  it('skips generation when fonts array is missing', async () => {
    const brand = 'startribune';

    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(JSON.stringify({ font: { brand: { startribune: {} } } }));

    await buildFontFaces(brand);

    expect(logSpy).toHaveBeenCalledWith(
      '⚠️  No fonts array in tokens/fonts/startribune.json, skipping...'
    );
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });

  it('ignores variants without files', async () => {
    const brand = 'startribune';

    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(
      JSON.stringify({
        font: {
          brand: {
            startribune: {
              fonts: [
                {
                  name: 'TestFont',
                  url: '/fonts/test',
                  variants: [
                    { weight: 400 }, // no file property
                  ],
                },
              ],
            },
          },
        },
      })
    );

    await buildFontFaces(brand);

    expect(writeFileSyncSpy).toHaveBeenCalled();
    const cssOutput = writeFileSyncSpy.mock.calls[0][1];
    expect(cssOutput).not.toContain('@font-face');
  });

  it('skips fonts with no name and logs a warning', async () => {
    const brand = 'startribune';
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tokenData = {
      font: {
        brand: {
          startribune: {
            fonts: [
              {
                // no "name" field — should be skipped
                url: '/fonts/test',
                variants: [{ file: 'test.woff2', style: 'normal', weight: 400 }],
              },
              {
                name: 'ValidFont',
                url: '/fonts/valid',
                variants: [{ file: 'valid.woff2', style: 'normal', weight: 400 }],
              },
            ],
          },
        },
      },
    };

    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(JSON.stringify(tokenData));

    await buildFontFaces(brand);

    // Warning was emitted for the nameless font
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Skipping font with no name'));

    // The valid font still produced @font-face output
    expect(writeFileSyncSpy).toHaveBeenCalled();
    const cssOutput = writeFileSyncSpy.mock.calls[0][1];
    expect(cssOutput).toContain("font-family: 'ValidFont';");
    // The nameless font must not appear
    expect(cssOutput).not.toContain("url('/fonts/test/test.woff2')");

    warnSpy.mockRestore();
  });
});

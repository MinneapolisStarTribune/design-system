import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import buildMobileTypography from '../build-mobile-typography.js';

describe('buildMobileTypography', () => {
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

  it('generates mobile typography tokens', async () => {
    const brand = 'startribune';
    const editorialData = {
      typography: {
        'article-body': {
          bold: {
            mobile: {
              value: {
                'font-family': 'Publico Text',
                'font-size': '17px',
                'font-weight': '700',
                'line-height': '1.32',
              },
            },
            tablet: {
                value: {
                  'font-family': 'Publico Text',
                  'font-size': '19px',
                  'font-weight': '800',
                  'line-height': '1.32',
                },
            },
            desktop: {
                value: {
                  'font-family': 'Publico Text',
                  'font-size': '21px',
                  'font-weight': '900',
                  'line-height': '1.32',
                },
            },
          },
        },
      },
    };

    existsSyncSpy.mockImplementation((filePath) => {
      if (filePath.includes('editorial/startribune.json')) return true;
      return false;
    });
    readFileSyncSpy.mockReturnValue(JSON.stringify(editorialData));

    await buildMobileTypography(brand);

    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    const jsContent = writeFileSyncSpy.mock.calls.find(call => 
      call[0].includes('startribune-typography.js')
    )[1];
    
    expect(jsContent).toContain('export default');
    expect(jsContent).toContain('articleBody');
    expect(jsContent).toContain('bold');
    expect(jsContent).toContain('"fontSize": 17');
    expect(jsContent).toContain('"fontWeight": "700"');
  });

  it('falls back to direct value when mobile is not available', async () => {
    const editorialData = {
      typography: {
        'article-body': {
          h1: {
            value: {
              'font-family': 'Publico Headline',
              'font-size': '34px',
            },
          },
        },
      },
    };

    existsSyncSpy.mockImplementation((filePath) => {
      if (filePath.includes('editorial/startribune.json')) return true;
      return false;
    });
    readFileSyncSpy.mockReturnValue(JSON.stringify(editorialData));

    await buildMobileTypography('startribune');

    const jsContent = writeFileSyncSpy.mock.calls.find(call => 
      call[0].includes('startribune-typography.js')
    )[1];
    
    expect(jsContent).toContain('"fontSize": 34');
    expect(jsContent).toContain('h1');
  });

  it('converts kebab-case to camelCase', async () => {
    const editorialData = {
      typography: {
        'article-body': {
          'bold-italic': {
            mobile: {
              value: {
                'font-family': 'Publico Text',
                'font-size': '17px',
              },
            },
          },
        },
      },
    };

    existsSyncSpy.mockImplementation((filePath) => {
      if (filePath.includes('editorial/startribune.json')) return true;
      return false;
    });
    readFileSyncSpy.mockReturnValue(JSON.stringify(editorialData));

    await buildMobileTypography('startribune');

    const jsContent = writeFileSyncSpy.mock.calls.find(call => 
      call[0].includes('startribune-typography.js')
    )[1];
    
    expect(jsContent).toContain('articleBody');
    expect(jsContent).toContain('boldItalic');
    expect(jsContent).toContain('fontFamily');
    expect(jsContent).toContain('fontSize');
  });
});

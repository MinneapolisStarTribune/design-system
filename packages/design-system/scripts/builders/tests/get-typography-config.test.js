/**
 * @vitest-environment node
 */

import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import buildMobileTypography from '../build-mobile-typography.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..', '..', '..');
const typographyPath = path.join(
  projectRoot,
  'dist/mobile/typography/startribune-typography.js',
);

describe('getTypographyConfig mobile output', () => {
  beforeAll(async () => {
    process.chdir(projectRoot);
    await buildMobileTypography('startribune');
  });

  it('omits fontWeight and fontStyle from built typography tokens', async () => {
    const typography = (await import(typographyPath)).default;

    const italicVariant = typography.typographyEditorialOpinionH1;
    expect(italicVariant.fontFamily).toBe('PublicoHeadline-LightItalic');
    expect(italicVariant).not.toHaveProperty('fontStyle');
    expect(italicVariant).not.toHaveProperty('fontWeight');

    const regularVariant = typography.typographyArticleBodyRegular;
    expect(regularVariant.fontFamily).toBe('PublicoText-Roman');
    expect(regularVariant).not.toHaveProperty('fontStyle');
    expect(regularVariant).not.toHaveProperty('fontWeight');
    expect(regularVariant.fontSize).toBeTypeOf('number');
  });
});

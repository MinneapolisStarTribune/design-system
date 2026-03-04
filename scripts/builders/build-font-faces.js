const fs = require('fs');
const path = require('path');

const TOKENS_DIR_PREFIX = 'tokens/fonts';
const OUT_DIR_PREFIX = 'dist/web/fonts/font-face';
/**
 * Build @font-face CSS from tokens/fonts/{brand}.json
 *
 * Reads font definitions (name, family, url, variants) and outputs
 * one @font-face rule per variant. Writes to dist/web/fonts/font-face/{brand}.css.
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @returns {Promise<void>}
 */
async function buildFontFaces(brand) {
  const tokensPath = path.join(process.cwd(), `${TOKENS_DIR_PREFIX}/${brand}.json`);
  if (!fs.existsSync(tokensPath)) {
    console.log(`⚠️  No font tokens found for ${brand}, skipping @font-face build...`);
    return;
  }

  console.log(`\nBuilding @font-face CSS for ${brand}...`);

  const data = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  const fonts = data?.font?.brand?.[brand]?.fonts;
  if (!Array.isArray(fonts)) {
    console.log(`⚠️  No fonts array in ${TOKENS_DIR_PREFIX}/${brand}.json, skipping...`);
    return;
  }

  const rules = [];
  rules.push('/**');
  rules.push(` * Do not edit directly. Generated from ${TOKENS_DIR_PREFIX}/${brand}.json`);
  rules.push(' * Load only when brand="' + brand + '"');
  rules.push(' */');
  rules.push('');

  for (const font of fonts) {
    // Use font.name for @font-face - it's the font identifier. font.family includes
    // the fallback (e.g. "Publico Headline Condensed, serif") which would register
    // the wrong identifier and cause the browser to fall back to generic serif.
    const family = font.name || font.family;
    const baseUrl = (font.url || '').replace(/\/?$/, '/');

    for (const v of font.variants || []) {
      const weight = v.weight ?? 400;
      const style = v.style ?? 'normal';
      const file = v.file || '';
      const src = file ? baseUrl + file : '';

      if (!src) continue;

      rules.push('@font-face {');
      rules.push(`  font-family: '${(family || '').replace(/'/g, "\\'")}';`);
      rules.push(`  src: url('${src}') format('woff2');`);
      rules.push(`  font-weight: ${weight};`);
      rules.push(`  font-style: ${style};`);
      rules.push('  font-display: swap;');
      rules.push('}');
      rules.push('');
    }
  }

  const outDir = path.join(process.cwd(), OUT_DIR_PREFIX);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, `${brand}.css`);
  fs.writeFileSync(outPath, rules.join('\n'), 'utf8');

  console.log(`✓ ${brand} @font-face CSS built → ${OUT_DIR_PREFIX}/${brand}.css`);
}

module.exports = buildFontFaces;

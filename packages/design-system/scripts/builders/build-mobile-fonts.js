const fs = require('fs');
const path = require('path');

const TOKENS_DIR_PREFIX = 'tokens/fonts';
const OUT_DIR_PREFIX = 'dist/mobile/fonts';

/**
 * Convert a font name to a camelCase key.
 * "Publico Text" → "publicoText", "Graphik Condensed" → "graphikCondensed"
 */
function toCamelCaseKey(name) {
  return name
    .split(/\s+/)
    .map((word, i) =>
      i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
}

/**
 * Build mobile font tokens from tokens/fonts/{brand}.json
 *
 * Custom builder required because font source data uses arrays of objects with
 * nested variant arrays — a structure Style Dictionary's token tree model cannot
 * process. (SD requires a tree of objects with leaf { value } nodes.)
 * build-font-faces.js (web) is custom for the same reason.
 *
 * Outputs a keyed object for React Native consumption:
 * - Font family as bare name (no CSS fallback stack)
 * - File stems without extension (RN apps bundle .ttf/.otf, not .woff2)
 * - No web URLs (RN bundles fonts as local assets)
 * - module.exports for consistency with other mobile outputs
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @returns {Promise<void>}
 */
async function buildMobileFonts(brand) {
  const tokensPath = path.join(process.cwd(), `${TOKENS_DIR_PREFIX}/${brand}.json`);
  if (!fs.existsSync(tokensPath)) {
    console.log(`⚠️  No font tokens found for ${brand}, skipping mobile font build...`);
    return;
  }

  console.log(`\nBuilding mobile font tokens for ${brand}...`);

  const data = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  const fonts = data?.font?.brand?.[brand]?.fonts;
  if (!Array.isArray(fonts)) {
    console.log(`⚠️  No fonts array in ${TOKENS_DIR_PREFIX}/${brand}.json, skipping...`);
    return;
  }

  // Build a keyed object: camelCase font name → { fontFamily, variants }
  const fontTokens = {};
  for (const font of fonts) {
    const name = font.name || font.family?.split(',')[0]?.trim() || '';
    if (!name) continue;

    const key = toCamelCaseKey(name);
    fontTokens[key] = {
      // Bare font family name for React Native fontFamily style prop
      fontFamily: name,
      // Variants with weight, style, and file stem (no extension — RN apps provide .ttf/.otf)
      variants: (font.variants || []).map((variant) => ({
        weight: variant.weight ?? 400,
        style: variant.style ?? 'normal',
        file: (variant.file || '').replace(/\.[^.]+$/, ''),
      })),
    };
  }

  // Generate JavaScript file
  const jsContent = `/**
 * Do not edit directly, this file was auto-generated.
 * Generated from ${TOKENS_DIR_PREFIX}/${brand}.json
 * Mobile font configuration for React Native
 */

module.exports = ${JSON.stringify(fontTokens, null, 2)};
`;

  // Ensure output directory exists
  const outDir = path.join(process.cwd(), OUT_DIR_PREFIX);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Write JavaScript file
  const jsPath = path.join(outDir, `${brand}-fonts.js`);
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log(`✓ ${brand} mobile fonts built → ${OUT_DIR_PREFIX}/${brand}-fonts.js`);
}

module.exports = buildMobileFonts;

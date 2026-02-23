const fs = require('fs');
const path = require('path');

const TOKENS_DIR_PREFIX = 'tokens/fonts';
const OUT_DIR_PREFIX = 'dist/mobile';

/**
 * Build mobile font tokens from tokens/fonts/{brand}.json
 *
 * Reads font definitions and outputs JavaScript/TypeScript files with font information
 * for React Native consumption. React Native uses font names (not CSS font stacks)
 * and requires font files to be bundled into the app.
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

  // Build font tokens structure for React Native
  // These are used for font bundling metadata - typography tokens already provide fontFamily
  const fontsArray = fonts.map((font) => ({
    // Font name used in React Native (fontFamily prop)
    name: font.name,
    // Full font family stack (for reference, not used in RN)
    family: font.family,
    // Base URL for font files (web URLs, but RN apps need to bundle fonts)
    url: font.url || '',
    // Available variants with weight, style, and file information
    variants: (font.variants || []).map((variant) => ({
      weight: variant.weight ?? 400,
      style: variant.style ?? 'normal',
      file: variant.file || '',
      // Full URL to font file (for reference)
      url: variant.file && font.url
        ? `${font.url.replace(/\/?$/, '/')}${variant.file}`
        : null,
    })),
  }));

  const fontTokens = {
    // Array of all fonts with detailed information for bundling
    fonts: fontsArray,
  };

  // Generate JavaScript file
  const jsContent = `/**
 * Do not edit directly. Generated from ${TOKENS_DIR_PREFIX}/${brand}.json
 * Mobile font tokens for React Native - font bundling metadata
 */

export default ${JSON.stringify(fontTokens, null, 2)};
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

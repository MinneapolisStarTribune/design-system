const fs = require('fs');
const path = require('path');

/**
 * Build Combined CSS Files
 *
 * Combines typography CSS and theme CSS into single files per brand/theme combination.
 * This eliminates FOUC risk and simplifies the API (one import instead of two).
 *
 * Output files:
 * - dist/web/{brand}-{mode}.css (combined typography + themes)
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @param {string} mode - The color scheme ('light' or 'dark')
 * @returns {Promise<void>} Resolves when combined CSS is built
 */
async function buildCombinedCSS(brand, mode) {
  const fontsPath = path.join(process.cwd(), `dist/web/fonts/${brand}.css`);
  const themesPath = path.join(process.cwd(), `dist/web/themes/${brand}-${mode}.css`);
  const outputPath = path.join(process.cwd(), `dist/web/${brand}-${mode}.css`);

  // Check if source files exist
  const fontsExists = fs.existsSync(fontsPath);
  const themesExists = fs.existsSync(themesPath);

  if (!fontsExists && !themesExists) {
    console.log(`⚠️  No source files found for ${brand}-${mode}, skipping combined CSS build...`);
    return;
  }

  if (!fontsExists) {
    console.log(`⚠️  Typography file not found for ${brand}, continuing with themes only...`);
  }

  if (!themesExists) {
    console.log(`⚠️  Theme file not found for ${brand}-${mode}, continuing with typography only...`);
  }

  // Read source files
  const fontsCSS = fontsExists ? fs.readFileSync(fontsPath, 'utf8') : '';
  const themesCSS = themesExists ? fs.readFileSync(themesPath, 'utf8') : '';

  // Combine with clear separation and header comment
  const header = `/**\n * Do not edit directly. This file is auto-generated.\n * Combines typography classes and CSS variables for ${brand} ${mode} theme.\n */\n`;
  const separator = '\n\n/* ============================================\n * CSS Variables (Theme)\n * ============================================ */\n\n';
  const typographyHeader = '\n\n/* ============================================\n * Typography Classes\n * ============================================ */\n\n';

  let combined = header;
  
  if (themesCSS) {
    combined += separator + themesCSS;
  }
  
  if (fontsCSS) {
    combined += typographyHeader + fontsCSS;
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write combined file
  fs.writeFileSync(outputPath, combined, 'utf8');
  console.log(`✓ Combined CSS built → dist/web/${brand}-${mode}.css`);
}

module.exports = buildCombinedCSS;

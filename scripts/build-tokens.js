/**
 * Build Tokens Script
 *
 * This script generates CSS theme files from design tokens using Style Dictionary.
 * It creates separate CSS files for each brand (startribune, varsity) and color scheme (light, dark).
 *
 * Current State:
 * - ✅ Uses Style Dictionary for token processing and CSS generation
 * - ✅ Reads token JSON files from the tokens/ directory
 * - ✅ Resolves token references (e.g., {color.neutral.500})
 * - ✅ Generates typography utility classes for each brand
 * - ❌ NOT YET IMPLEMENTED: Figma integration/bridge to automatically sync tokens from Figma
 *
 * Future Goal:
 * We want to build a bridge between Figma and this codebase using Style Dictionary,
 * so that design tokens can be automatically synced from Figma without manual JSON file updates.
 * This integration has not been implemented yet - currently tokens are maintained manually
 * in the tokens/ directory.
 *
 * Output files:
 * Web Files:
 * - dist/web/themes/startribune-light.css
 * - dist/web/themes/startribune-dark.css
 * - dist/web/themes/varsity-light.css
 * - dist/web/themes/varsity-dark.css
 * - dist/web/fonts/editorial/startribune-fonts.css
 * - dist/web/fonts/editorial/varsity-fonts.css
 * - dist/web/fonts/utility/startribune-fonts.css (shared + startribune overrides)
 * - dist/web/fonts/utility/varsity-fonts.css (shared + varsity overrides)
 * - dist/web/fonts/font-face/startribune.css (@font-face from tokens/fonts/startribune.json)
 * - dist/web/fonts/font-face/varsity.css (@font-face from tokens/fonts/varsity.json)
 * Mobile JavaScript Files (no .d.ts files - TypeScript can infer types from JSON exports):
 * - dist/mobile/startribune-light.js
 * - dist/mobile/startribune-dark.js
 * - dist/mobile/varsity-light.js
 * - dist/mobile/varsity-dark.js
 * - dist/mobile/startribune-fonts.js
 * - dist/mobile/varsity-fonts.js
 * - dist/mobile/startribune-typography.js
 * - dist/mobile/varsity-typography.js
 *
 * Each theme file contains CSS variables in :root that can be imported and used in web applications.
 * Each mobile token file contains JavaScript ES6 modules that can be imported in React Native applications.
 * Each fonts file contains typography utility classes.
 *
 * Usage:
 *   node scripts/build-tokens.js
 *   or
 *   yarn tokens
 *
 * The script:
 * 1. Reads token JSON files from the tokens/ directory
 * 2. Resolves token references (e.g., {color.neutral.500})
 * 3. Formats tokens as CSS variables (for web) and JavaScript ES6 modules (for mobile)
 * 4. Writes CSS files to dist/web/themes/
 * 5. Writes JavaScript token files to dist/mobile/ (TypeScript can infer types from JSON exports)
 * 7. Generates editorial typography classes to dist/web/fonts/editorial/
 * 8. Generates utility typography classes to dist/web/fonts/utility/ (shared.json common for both)
 * 9. Generates @font-face CSS from tokens/fonts/ to dist/web/fonts/font-face/{brand}.css (web)
 * 10. Generates mobile font tokens from tokens/fonts/ to dist/mobile/{brand}-fonts.js (React Native)
 * 11. Generates mobile typography tokens from tokens/typography/ to dist/mobile/{brand}-typography.js (React Native)
 */

const buildThemeTokens = require('./builders/build-theme-tokens');
const buildTypographyClasses = require('./builders/build-typography-classes');
const buildUtilityTypographyClasses = require('./builders/build-utility-typography-classes');
const buildFontFaces = require('./builders/build-font-faces');
const buildMobileFonts = require('./builders/build-mobile-fonts');
const buildMobileTypography = require('./builders/build-mobile-typography');

/**
 * Main Build Function
 *
 * Orchestrates the token building process for all brands and color schemes.
 * Generates CSS files for each combination:
 * - startribune + light → startribune-light.css
 * - startribune + dark → startribune-dark.css
 * - varsity + light → varsity-light.css
 * - varsity + dark → varsity-dark.css
 *
 * Also generates typography class files:
 * - dist/web/fonts/editorial/: startribune-fonts.css, varsity-fonts.css (editorial only)
 * - dist/web/fonts/utility/: startribune-fonts.css, varsity-fonts.css (shared + brand overrides)
 *
 * Process:
 * 1. Iterates through all brand/mode combinations
 * 2. Creates Style Dictionary configuration for each (CSS, JavaScript, TypeScript platforms)
 * 3. Builds CSS files, JavaScript token files, and TypeScript declarations using Style Dictionary
 * 4. Builds typography classes for each brand
 * 5. Logs progress and completion
 *
 * @returns {Promise<void>} Resolves when all tokens are built
 * @throws {Error} If any build fails, the process exits with error code 1
 */
async function buildTokens() {
  console.log('Building design tokens...\n');

  const brands = ['startribune', 'varsity'];
  const modes = ['light', 'dark'];

  // Build tokens for each brand/mode combination
  for (const brand of brands) {
    for (const mode of modes) {
      await buildThemeTokens(brand, mode);
    }
  }

  // Build editorial typography classes for each brand
  console.log('\n==============================================');
  console.log('Building typography classes...');

  for (const brand of brands) {
    await buildTypographyClasses(brand);
  }

  // Build utility typography classes (shared.json common for both; brand json overrides)
  console.log('\n==============================================');
  console.log('Building utility typography classes...');

  for (const brand of brands) {
    await buildUtilityTypographyClasses(brand);
  }

  // Build @font-face CSS from tokens/fonts/ (startribune.json, varsity.json)
  console.log('\n==============================================');
  console.log('Building @font-face CSS...');

  for (const brand of brands) {
    await buildFontFaces(brand);
  }

  // Build mobile font tokens from tokens/fonts/ (startribune.json, varsity.json)
  console.log('\n==============================================');
  console.log('Building mobile font tokens...');

  for (const brand of brands) {
    await buildMobileFonts(brand);
  }

  // Build mobile typography tokens from tokens/typography/ (editorial + utility)
  console.log('\n==============================================');
  console.log('Building mobile typography tokens...');

  for (const brand of brands) {
    await buildMobileTypography(brand);
  }

  console.log('\n==============================================');
  console.log('\n✓ All tokens built successfully!\n');
}

// Execute the build function
// If any error occurs, log it and exit with error code 1
// This ensures CI/CD pipelines fail if token generation fails
buildTokens().catch((error) => {
  console.error('Error building tokens:', error);
  process.exit(1);
});

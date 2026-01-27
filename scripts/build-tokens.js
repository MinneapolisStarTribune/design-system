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
 * - dist/themes/startribune-light.css
 * - dist/themes/startribune-dark.css
 * - dist/themes/varsity-light.css
 * - dist/themes/varsity-dark.css
 * - dist/fonts/startribune-fonts.css
 * - dist/fonts/varsity-fonts.css
 * 
 * Each theme file contains CSS variables in :root that can be imported and used in applications.
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
 * 3. Formats tokens as CSS variables
 * 4. Writes CSS files to dist/themes/
 * 5. Generates typography utility classes to dist/fonts/
 */

const buildThemeTokens = require('./builders/build-theme-tokens');
const buildTypographyClasses = require('./builders/build-typography-classes');

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
 * - startribune-fonts.css
 * - varsity-fonts.css
 * 
 * Process:
 * 1. Iterates through all brand/mode combinations
 * 2. Creates Style Dictionary configuration for each
 * 3. Builds CSS file using Style Dictionary
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

  // Build typography classes for each brand
  console.log('\n==============================================');
  console.log('Building typography classes...');
  
  for (const brand of brands) {
    await buildTypographyClasses(brand);
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

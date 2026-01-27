const StyleDictionary = require('style-dictionary').default;
const getStyleDictionaryConfig = require('./get-style-dictionary-config');
const cssVariablesFormat = require('../formats/css-variables');

/**
 * Build theme tokens for a specific brand and mode
 * 
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @param {string} mode - The color scheme ('light' or 'dark')
 * @returns {Promise<void>} Resolves when theme tokens are built
 */
async function buildThemeTokens(brand, mode) {
  console.log(`\n==============================================`);
  console.log(`Processing: ${brand}-${mode}`);

  // Get configuration for this specific brand/mode combination
  const config = getStyleDictionaryConfig(brand, mode, {
    cssVariables: cssVariablesFormat,
  });
  
  // Create Style Dictionary instance with the configuration
  const sd = new StyleDictionary(config);
  
  // Build all platforms (in this case, just CSS)
  // This reads token files, resolves references, and generates the CSS file
  await sd.buildAllPlatforms();

  console.log(`✓ ${brand}-${mode} tokens built`);
}

module.exports = buildThemeTokens;


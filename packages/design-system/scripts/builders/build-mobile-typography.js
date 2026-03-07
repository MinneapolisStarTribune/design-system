const StyleDictionary = require('style-dictionary').default;
const getTypographyConfig = require('./get-typography-config');

/**
 * Build mobile typography tokens for a specific brand using Style Dictionary.
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @returns {Promise<void>}
 */
async function buildMobileTypography(brand) {
  console.log(`\nBuilding mobile typography tokens for ${brand}...`);

  const config = getTypographyConfig(brand);
  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();

  console.log(`✓ ${brand} mobile typography built → dist/mobile/typography/${brand}-typography.js`);
}

module.exports = buildMobileTypography;

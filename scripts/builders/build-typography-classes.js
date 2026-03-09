const StyleDictionary = require('style-dictionary').default;
const path = require('path');
const fs = require('fs');
const typographyClassesFormat = require('../formats/typography-classes');

/**
 * Build Typography Classes for a Brand and Mode
 *
 * Generates CSS classes from both typography.editorial and typography.utility tokens.
 * Combines editorial and utility typography into a single CSS file with theme-aware color.
 * Output goes to dist/web/fonts/{brand}-{mode}.css.
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @param {string} mode - The color scheme ('light' or 'dark')
 * @returns {Promise<void>} Resolves when typography classes are built
 */
async function buildTypographyClasses(brand, mode) {
  console.log(`\nBuilding typography classes (editorial + utility) for ${brand} ${mode}...`);

  // Load all typography source files: editorial, utility shared, and utility brand-specific
  const sourceFiles = [
    'tokens/text.json',
    `tokens/typography/editorial/${brand}.json`,
    'tokens/typography/utility/shared.json',
    `tokens/typography/utility/${brand}.json`,
  ];

  // Check if required files exist
  const editorialFile = path.join(process.cwd(), `tokens/typography/editorial/${brand}.json`);
  const sharedUtilityFile = path.join(process.cwd(), 'tokens/typography/utility/shared.json');

  const hasEditorial = fs.existsSync(editorialFile);
  const hasUtility = fs.existsSync(sharedUtilityFile);

  if (!hasEditorial && !hasUtility) {
    console.log(`⚠️  No typography files found for ${brand}, skipping...`);
    return;
  }

  if (!hasEditorial) {
    console.log(`⚠️  No editorial typography file found for ${brand}, continuing with utility only...`);
  }

  if (!hasUtility) {
    console.log(`⚠️  No shared utility typography found, continuing with editorial only...`);
  }

  // Filter out non-existent files
  const existingSourceFiles = sourceFiles.filter((file) => {
    const filePath = path.join(process.cwd(), file);
    return fs.existsSync(filePath);
  });

  const config = {
    log: { verbosity: 'verbose' },
    source: existingSourceFiles,
    hooks: {
      formats: {
        'css/typography-classes': typographyClassesFormat,
      },
    },
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'dist/web/fonts/',
        files: [
          {
            destination: `${brand}-${mode}.css`,
            format: 'css/typography-classes',
            filter: (token) => {
              // Only include typography tokens
              return token.path[0] === 'typography';
            },
            options: {
              brand: brand,
              mode: mode,
            },
          },
        ],
      },
    },
  };

  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();

  console.log(`✓ ${brand} ${mode} typography classes built → dist/web/fonts/${brand}-${mode}.css`);
}

module.exports = buildTypographyClasses;

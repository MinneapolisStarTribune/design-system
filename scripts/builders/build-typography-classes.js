const StyleDictionary = require('style-dictionary').default;
const path = require('path');
const fs = require('fs');
const typographyClassesFormat = require('../formats/typography-classes');

/**
 * Build Editorial Typography Classes for a Brand
 *
 * Generates CSS classes from typography.editorial tokens only.
 * Output goes to dist/fonts/editorial/. Utility typography is built separately to dist/fonts/utility/.
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @returns {Promise<void>} Resolves when editorial typography classes are built
 */
async function buildTypographyClasses(brand) {
  console.log(`\nBuilding editorial typography classes for ${brand}...`);

  const sourceFiles = [
    'tokens/text.json',
    `tokens/typography/editorial/${brand}.json`,
  ];

  const editorialFile = path.join(process.cwd(), `tokens/typography/editorial/${brand}.json`);

  if (!fs.existsSync(editorialFile)) {
    console.log(`⚠️  No editorial typography file found for ${brand}, skipping...`);
    return;
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
        buildPath: 'dist/fonts/editorial/',
        files: [
          {
            destination: `${brand}.css`,
            format: 'css/typography-classes',
            filter: (token) => {
              // Only include typography tokens
              return token.path[0] === 'typography';
            },
            options: {
              brand: brand,
            },
          },
        ],
      },
    },
  };

  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();

  console.log(`✓ ${brand} typography classes built`);
}

module.exports = buildTypographyClasses;


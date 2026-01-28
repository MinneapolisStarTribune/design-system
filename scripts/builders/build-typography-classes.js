const StyleDictionary = require('style-dictionary').default;
const path = require('path');
const fs = require('fs');
const typographyClassesFormat = require('../formats/typography-classes');

/**
 * Build Typography Classes for a Brand
 * 
 * Generates CSS utility classes from typography tokens for a specific brand.
 * Loads both utility and editorial typography tokens and generates a single CSS file.
 * 
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @returns {Promise<void>} Resolves when typography classes are built
 */
async function buildTypographyClasses(brand) {
  console.log(`\nBuilding typography classes for ${brand}...`);

  const sourceFiles = [
    'tokens/text.json', // Primitives (font families)
    'tokens/typography/utility/index.json', // Shared utility typography tokens
    `tokens/typography/utility/${brand}.json`, // Brand-specific utility typography tokens
    `tokens/typography/editorial/${brand}.json`, // Editorial typography tokens
  ];

  // Check if typography files exist
  const utilityFile = path.join(process.cwd(), `tokens/typography/utility/${brand}.json`);
  const editorialFile = path.join(process.cwd(), `tokens/typography/editorial/${brand}.json`);

  if (!fs.existsSync(utilityFile) && !fs.existsSync(editorialFile)) {
    console.log(`⚠️  No typography files found for ${brand}, skipping...`);
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
        buildPath: 'dist/fonts/',
        files: [
          {
            destination: `${brand}-fonts.css`,
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


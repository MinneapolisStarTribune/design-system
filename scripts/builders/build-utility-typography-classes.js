const StyleDictionary = require('style-dictionary').default;
const path = require('path');
const fs = require('fs');
const typographyClassesFormat = require('../formats/typography-classes');

/**
 * Build Utility Typography Classes for a Brand
 *
 * Generates CSS utility classes from typography.utility tokens.
 * Loads shared.json (common for both brands) then brand-specific overrides.
 * Output goes to dist/fonts/utility/ so utility CSS is separate from editorial.
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @returns {Promise<void>} Resolves when utility typography classes are built
 */
async function buildUtilityTypographyClasses(brand) {
  console.log(`\nBuilding utility typography classes for ${brand}...`);

  // shared.json = common for both startribune and varsity; brand json = overrides
  const sourceFiles = [
    'tokens/text.json',
    'tokens/typography/utility/shared.json',
    `tokens/typography/utility/${brand}.json`,
  ];

  const sharedFile = path.join(process.cwd(), 'tokens/typography/utility/shared.json');
  const brandFile = path.join(process.cwd(), `tokens/typography/utility/${brand}.json`);

  if (!fs.existsSync(sharedFile)) {
    console.log(`⚠️  No shared utility typography found, skipping utility build for ${brand}...`);
    return;
  }

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
        buildPath: 'dist/fonts/utility/',
        files: [
          {
            destination: `${brand}.css`,
            format: 'css/typography-classes',
            filter: (token) => token.path[0] === 'typography',
            options: { brand },
          },
        ],
      },
    },
  };

  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();

  console.log(`✓ ${brand} utility typography classes built`);
}

module.exports = buildUtilityTypographyClasses;

const StyleDictionary = require('style-dictionary').default;

// Custom format for CSS variables in :root
const cssVariablesFormat = ({ dictionary }) => {
  const tokens = dictionary.allTokens
    .map((token) => {
      let varName = token.name.startsWith('--') ? token.name : `--${token.name}`;
      
      // Remove duplicate "color-" prefix if it exists
      if (varName.startsWith('--color-color-')) {
        varName = varName.replace('--color-color-', '--color-');
      }
      
      return `  ${varName}: ${token.value};`;
    })
    .join('\n');

  return `/**\n * Do not edit directly, this file was auto-generated.\n`;
};

function getStyleDictionaryConfig(brand) {
  return {
    log: { verbosity: 'verbose' },
    source: [
      'tokens/color/base.json',
      'tokens/color/global.json',
      `tokens/color/brand-${brand}.json`,
      'tokens/color/semantic.json',
      'tokens/text.json',
      'tokens/border-radius.json',
      'tokens/spacing.json',
      'tokens/breakpoint.json',
    ],
    hooks: {
      formats: {
        'css/variables': cssVariablesFormat,
      },
    },
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: `dist/themes/`,
        files: [
          {
            destination: `${brand}.css`,
            format: 'css/variables',
          },
        ],
      },
    },
  };
}

async function buildTokens() {
  console.log('Building design tokens...\n');

  const brands = ['startribune', 'varsity'];

  for (const brand of brands) {
    console.log(`\n==============================================`);
    console.log(`Processing: ${brand}`);

    const sd = new StyleDictionary(getStyleDictionaryConfig(brand));
    await sd.buildAllPlatforms();

    console.log(`✓ ${brand} tokens built`);
  }

  console.log('\n==============================================');
  console.log('\n✓ All tokens built successfully!\n');
}

buildTokens().catch((error) => {
  console.error('Error building tokens:', error);
  process.exit(1);
});


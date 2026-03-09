const fs = require('fs');
const path = require('path');
const StyleDictionary = require('style-dictionary').default;

const BREAKPOINTS = ['mobile', 'desktop', 'tablet'];

/**
 * SD Preprocessor: Extract mobile breakpoint values from the token tree.
 */
StyleDictionary.registerPreprocessor({
  name: 'mobile-breakpoint',
  preprocessor: (dictionary) => {
    function extract(obj) {
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

      // If this node has breakpoint children that are tokens, collapse to mobile
      const hasBreakpoints = BREAKPOINTS.some(
        (bp) => bp in obj && obj[bp] && typeof obj[bp] === 'object' && 'value' in obj[bp],
      );
      if (hasBreakpoints) {
        // Prefer mobile breakpoint; tokens without a mobile key pass through untouched
        return obj.mobile || obj;
      }

      // Recurse into children
      const result = {};
      for (const [key, val] of Object.entries(obj)) {
        result[key] = extract(val);
      }
      return result;
    }

    return extract(dictionary);
  },
});

/**
 * SD Value Transform: Convert composite token values (CSS property objects)
 * to React Native format.
 *
 * This transform converts kebab-case CSS keys to camelCase and px strings
 * to numbers, which SD cannot do for object-valued tokens.
 */
StyleDictionary.registerTransform({
  name: 'value/mobile-breakpoint',
  type: 'value',
  transitive: true,
  filter: (token) => typeof token.value === 'object' && !Array.isArray(token.value),
  transform: (token) => {
    const raw = token.value;
    const result = {};

    // First pass: collect fontSize so lineHeight can be resolved to absolute px
    let fontSize;
    for (const [key, val] of Object.entries(raw)) {
      if (key === 'fontSize' || key === 'font-size') {
        fontSize = typeof val === 'string' && val.endsWith('px') ? parseFloat(val) : Number(val);
      }
    }

    for (const [key, val] of Object.entries(raw)) {
      const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

      if (camelKey === 'fontSize' && typeof val === 'string' && val.endsWith('px')) {
        result[camelKey] = parseFloat(val);
      } else if (camelKey === 'lineHeight') {
        // CSS relative multiplier (e.g. "1.15") → absolute px for RN
        const num = parseFloat(val);
        if (!isNaN(num) && fontSize) {
          result[camelKey] = num <= 10 ? Math.round(fontSize * num) : num;
        } else {
          result[camelKey] = num;
        }
      } else if (camelKey === 'fontFamily' && typeof val === 'string') {
        // Strip CSS fallbacks: "Publico Headline, serif" → "Publico Headline"
        result[camelKey] = val.split(',')[0].trim();
      } else {
        result[camelKey] = val;
      }
    }
    return result;
  },
});

/**
 * Get StyleDictionary configuration for typography tokens.
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @returns {Object} Style Dictionary configuration object
 */
function getTypographyConfig(brand) {
  const sourceFiles = [
    // Font tokens for reference resolution (e.g. {font.family.publico-text})
    'tokens/primitives/text.json',
    // Editorial typography (brand-specific)
    `tokens/typography/editorial/${brand}.json`,
    // Utility typography (shared across brands)
    'tokens/typography/utility/shared.json',
  ];

  // Add brand-specific utility overrides if they exist
  const utilityBrandPath = `tokens/typography/utility/${brand}.json`;
  if (fs.existsSync(path.join(process.cwd(), utilityBrandPath))) {
    sourceFiles.push(utilityBrandPath);
  }

  return {
    log: { verbosity: 'verbose' },
    source: sourceFiles,
    preprocessors: ['mobile-breakpoint'],
    platforms: {
      javascript: {
        transformGroup: 'react-native',
        transforms: ['value/mobile-breakpoint'],
        buildPath: 'dist/mobile/typography/',
        files: [
          {
            destination: `${brand}-typography.js`,
            format: 'javascript/module-flat',
            filter: (token) => token.path[0] === 'typography',
          },
        ],
      },
    },
  };
}

module.exports = getTypographyConfig;

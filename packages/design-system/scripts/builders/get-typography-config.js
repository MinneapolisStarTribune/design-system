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
        (bp) => bp in obj && obj[bp] && typeof obj[bp] === 'object' && 'value' in obj[bp]
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
 * Build a lookup map from font variant data: "FamilyName|weight|style" → PostScript-style name.
 * Derives the RN font name from the variant file field by stripping the -Web suffix and extension.
 *
 * @param {string} brand - The brand name
 * @returns {Record<string, string>} e.g. { "Publico Headline|400|italic": "PublicoHeadline-Italic" }
 */
function buildFontVariantMap(brand) {
  const fontPath = path.join(process.cwd(), `tokens/fonts/${brand}.json`);
  if (!fs.existsSync(fontPath)) return {};

  const fontData = JSON.parse(fs.readFileSync(fontPath, 'utf8'));
  const fonts = fontData.font.brand[brand].fonts;
  const map = {};

  for (const font of fonts) {
    for (const variant of font.variants) {
      const key = `${font.name}|${variant.weight}|${variant.style}`;
      const stem = variant.file.replace(/\.(woff2?|ttf|otf|eot)$/i, '').replace(/-Web$/, '');
      map[key] = stem;
    }
  }

  return map;
}

/**
 * Get StyleDictionary configuration for typography tokens.
 *
 * Registers the value/mobile-breakpoint transform with the current brand's
 * font variant map so fontFamily values resolve to RN-compatible names.
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @returns {Object} Style Dictionary configuration object
 */
function getTypographyConfig(brand) {
  const fontVariantMap = buildFontVariantMap(brand);

  /**
   * SD Value Transform: Convert composite typography token values to React Native format.
   *
   * - kebab-case CSS keys → camelCase
   * - fontSize (number) → number
   * - lineHeight (number, multiplier) → absolute px when ≤10, else number
   * - fontFamily → variant-specific PostScript name via font data lookup
   */
  StyleDictionary.registerTransform({
    name: 'value/mobile-breakpoint',
    type: 'value',
    transitive: true,
    filter: (token) => typeof token.value === 'object' && !Array.isArray(token.value),
    transform: (token) => {
      const raw = token.value;
      const result = {};

      let fontSize;
      let fontWeight = '400';
      let fontStyle = 'normal';
      for (const [key, val] of Object.entries(raw)) {
        const k = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        if (k === 'fontSize' || k === 'font-size') {
          fontSize = typeof val === 'number' ? val : Number(val);
        } else if (k === 'fontWeight' || key === 'font-weight') {
          fontWeight = String(val);
        } else if (k === 'fontStyle' || key === 'font-style') {
          fontStyle = String(val);
        }
      }

      for (const [key, val] of Object.entries(raw)) {
        const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

        if (camelKey === 'fontSize') {
          result[camelKey] = typeof val === 'number' ? val : Number(val);
        } else if (camelKey === 'lineHeight') {
          const num = typeof val === 'number' ? val : Number(val);
          result[camelKey] =
            !isNaN(num) && fontSize && num <= 10 ? Math.round(fontSize * num) : num;
        } else if (camelKey === 'fontFamily' && typeof val === 'string') {
          const familyName = val.split(',')[0].trim();
          const lookupKey = `${familyName}|${fontWeight}|${fontStyle}`;
          result[camelKey] = fontVariantMap[lookupKey] || familyName;
        } else if (camelKey === 'letterSpacing') {
          if (typeof val === 'string') {
            if (val.trim() === '0' || val === 'normal') {
              result[camelKey] = 0;
            } else if (val.endsWith('em')) {
              const emValue = parseFloat(val.replace('em', ''));
              result[camelKey] = !isNaN(emValue) && fontSize ? emValue * fontSize : emValue;
            } else if (val.endsWith('px')) {
              result[camelKey] = parseFloat(val.replace('px', ''));
            } else {
              const parsed = Number(val);
              result[camelKey] = isNaN(parsed) ? 0 : parsed;
            }
          } else {
            result[camelKey] = typeof val === 'number' ? val : 0;
          }
        } else {
          result[camelKey] = val;
        }
      }
      return result;
    },
  });
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

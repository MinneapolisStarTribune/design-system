const fs = require('fs');
const path = require('path');

/**
 * Token file loading strategy:
 * 
 * 1. Always loads base tokens (global.json)
 * 2. Loads mode-specific button tokens (button-light.json or button-dark.json)
 * 3. Loads brand-specific color tokens for the mode (brand-{brand}-{mode}.json)
 * 4. Loads shared tokens (text, border-radius, spacing, breakpoint)
 * 5. Loads brand-specific semantic tokens (tokens/semantic/{brand}.json) - optional
 * 
 * Semantic tokens provide brand-specific styling decisions that aren't about color or fonts.
 * Examples: photo-layout-border-radius (Star Tribune uses pointy corners, Varsity uses rounded)
 * 
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @param {string} mode - The color scheme ('light' or 'dark')
 * @param {Object} formats - Custom format functions to register
 * @returns {Object} Style Dictionary configuration object
 * 
 * @example
 * const config = getStyleDictionaryConfig('startribune', 'light', { cssVariables, typographyClasses });
 * Returns config that will generate:
 * - startribune-light.css (web CSS variables)
 * - startribune-light.js (mobile JavaScript tokens)
 */
function getStyleDictionaryConfig(brand, mode, formats = {}) {
  // Helper function to check if file exists and throw error if not
  const requireFile = (filePath, fileDescription) => {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.error(
        `❌ Error: Required token file not found: ${filePath}\n` +
        `   ${fileDescription}\n` +
        `   Expected location: ${fullPath}`
      );
      throw new Error(`Missing required token file: ${filePath}`);
    }
    return filePath;
  };

  // Required base files - must exist
  const baseFiles = [
    requireFile('tokens/primitives/color.json', 'Global color palettes (core colors shared across modes)'),
    requireFile(`tokens/color/button-${mode}.json`, `Mode-specific button tokens (${mode})`),
  ];

  const sourceFiles = [...baseFiles];

  // Add brand-specific file - must exist for the requested mode
  const brandFile = `tokens/color/brand-${brand}-${mode}.json`;
  requireFile(brandFile, `Brand-specific colors for ${brand} (${mode} mode)`);
  sourceFiles.push(brandFile);

  // Add shared primitive token files that apply to all brands and modes
  // These must be loaded before semantic tokens so semantic tokens can reference them
  // Note: semantic colors are mode-specific and defined in brand files, not in a shared file
  const sharedFiles = [
    requireFile('tokens/primitives/text.json', 'Font family definitions'),
    requireFile('tokens/primitives/border-radius.json', 'Border radius tokens'),
    requireFile('tokens/primitives/spacing.json', 'Spacing tokens'),
    requireFile('tokens/primitives/breakpoint.json', 'Breakpoint definitions'),
  ];
  
  sourceFiles.push(...sharedFiles);

  // Add brand-specific semantic tokens (styling differences like border radius, etc.)
  // These are loaded AFTER shared tokens so they can reference shared values like {radius.4}
  // Semantic tokens provide brand-specific styling decisions (e.g., photo-layout-border-radius)
  const semanticFile = `tokens/semantic/${brand}.json`;
  const semanticFilePath = path.join(process.cwd(), semanticFile);
  if (fs.existsSync(semanticFilePath)) {
    sourceFiles.push(semanticFile);
  }
  // Note: semantic tokens are optional - not all brands need semantic overrides

  // Build formats object
  const formatsConfig = {};
  if (formats.cssVariables) {
    formatsConfig['css/variables'] = formats.cssVariables;
  }
  if (formats.typographyClasses) {
    formatsConfig['css/typography-classes'] = formats.typographyClasses;
  }

  // Return Style Dictionary configuration
  return {
    // Verbose logging helps debug token resolution issues
    log: { verbosity: 'verbose' },
    
    // Source files to read tokens from (in order - later files can override earlier ones)
    source: sourceFiles,

    // Custom format registration
    // This tells Style Dictionary to use our custom format functions
    hooks: {
      formats: formatsConfig,
    },
    
    // Platform configuration - defines output format and location
    platforms: {
      css: {
        // Use CSS transform group - handles token reference resolution
        // This automatically resolves {color.neutral.500} references to actual hex values
        transformGroup: 'web',
        
        // Output directory for generated CSS files
        buildPath: `dist/web/themes/`,
        
        // File generation configuration
        files: [
          {
            // Output filename: {brand}-{mode}.css
            // Examples: startribune-light.css, varsity-dark.css
            destination: `${brand}-${mode}.css`,
            
            // Use our custom format function
            format: 'css/variables',
            "options": {
              "outputReferences": true
            }
          },
        ],
      },
      javascript: {
        // Use JS transform group - Style Dictionary preserves numbers natively as numbers
        transformGroup: 'react-native',
        
        // Output directory for generated JavaScript token files
        buildPath: `dist/mobile/themes/`,
        
        // File generation configuration
        files: [
          {
            // Output filename: {brand}-{mode}.js
            // Examples: startribune-light.js, varsity-dark.js
            destination: `${brand}-${mode}.js`,
            
            // Use Style Dictionary's built-in JavaScript ES6 module format
            format: 'javascript/es6',
          },
        ],
      },
    },
  };
}

module.exports = getStyleDictionaryConfig;


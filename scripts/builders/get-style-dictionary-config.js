const fs = require('fs');
const path = require('path');

/**
 * Token file loading strategy:
 * 
 * 1. Always loads base tokens (global.json)
 * 2. Loads mode-specific button tokens (button-light.json or button-dark.json)
 * 3. Tries to load brand-specific tokens for the mode (brand-{brand}-{mode}.json)
 * 4. Falls back to generic brand tokens (brand-{brand}.json) if mode-specific doesn't exist
 * 5. Loads shared tokens (semantic, text, spacing, etc.)
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
    requireFile('tokens/color/global.json', 'Global color palettes (core colors shared across modes)'),
    requireFile(`tokens/color/button-${mode}.json`, `Mode-specific button tokens (${mode})`),
  ];

  const sourceFiles = [...baseFiles];

  // Add brand-specific file - must exist for the requested mode
  const brandFile = `tokens/color/brand-${brand}-${mode}.json`;
  requireFile(brandFile, `Brand-specific colors for ${brand} (${mode} mode)`);
  sourceFiles.push(brandFile);

  // Add shared token files that apply to all brands and modes
  // Note: semantic colors are mode-specific and defined in brand files, not in a shared file
  const sharedFiles = [
    requireFile('tokens/text.json', 'Font family definitions'),
    requireFile('tokens/border-radius.json', 'Border radius tokens'),
    requireFile('tokens/spacing.json', 'Spacing tokens'),
    requireFile('tokens/breakpoint.json', 'Breakpoint definitions'),
  ];
  
  sourceFiles.push(...sharedFiles);

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
        transformGroup: 'css',
        
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
          },
        ],
      },
      javascript: {
        // Use JavaScript transform group - handles token reference resolution for JS output
        // This automatically resolves {color.neutral.500} references to actual hex values
        transformGroup: 'js',
        
        // Output directory for generated JavaScript token files
        buildPath: `dist/mobile/`,
        
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


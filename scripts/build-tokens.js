/**
 * Build Tokens Script
 * 
 * This script generates CSS theme files from design tokens using Style Dictionary.
 * It creates separate CSS files for each brand (startribune, varsity) and color scheme (light, dark).
 * 
 * Current State:
 * - ✅ Uses Style Dictionary for token processing and CSS generation
 * - ✅ Reads token JSON files from the tokens/ directory
 * - ✅ Resolves token references (e.g., {color.neutral.500})
 * - ❌ NOT YET IMPLEMENTED: Figma integration/bridge to automatically sync tokens from Figma
 * 
 * Future Goal:
 * We want to build a bridge between Figma and this codebase using Style Dictionary,
 * so that design tokens can be automatically synced from Figma without manual JSON file updates.
 * This integration has not been implemented yet - currently tokens are maintained manually
 * in the tokens/ directory.
 * 
 * Output files:
 * - dist/themes/startribune-light.css
 * - dist/themes/startribune-dark.css
 * - dist/themes/varsity-light.css
 * - dist/themes/varsity-dark.css
 * 
 * Each file contains CSS variables in :root that can be imported and used in applications.
 * 
 * Usage:
 *   node scripts/build-tokens.js
 *   or
 *   yarn tokens
 * 
 * The script:
 * 1. Reads token JSON files from the tokens/ directory
 * 2. Resolves token references (e.g., {color.neutral.500})
 * 3. Formats tokens as CSS variables
 * 4. Writes CSS files to dist/themes/
 */

const StyleDictionary = require('style-dictionary').default;

/**
 * Custom CSS Variables Format
 * 
 * This function formats Style Dictionary tokens into CSS variables that will be
 * placed inside a :root selector. It handles:
 * - Ensuring all variable names start with --
 * - Removing duplicate "color-" prefixes that can occur during token resolution
 * - Formatting as valid CSS variable declarations
 * 
 * @param {Object} options - Style Dictionary format options
 * @param {Object} options.dictionary - The Style Dictionary token dictionary
 * @returns {string} Complete CSS file content with :root block and all variables
 * 
 * Example output:
 * ```
 * /**
 *  * Do not edit directly, this file was auto-generated.
 *  *\/
 * :root {
 *   --color-base-black: #000000;
 *   --color-base-white: #ffffff;
 *   --color-icon-on-light-primary: #0D0D0D;
 *   ...
 * }
 * ```
 */
const cssVariablesFormat = ({ dictionary }) => {
  // Transform all tokens into CSS variable declarations
  const tokens = dictionary.allTokens
    .map((token) => {
      // Ensure variable name starts with -- (CSS variable prefix)
      // Style Dictionary may or may not include it depending on token path
      let varName = token.name.startsWith('--') ? token.name : `--${token.name}`;
      
      // Fix duplicate "color-" prefix that can occur when tokens reference other tokens
      // e.g., "color-color-icon-on-light-primary" -> "color-icon-on-light-primary"
      // This happens when a token path includes "color" and the resolved value also includes "color"
      if (varName.startsWith('--color-color-')) {
        varName = varName.replace('--color-color-', '--color-');
      }
      
      // Format as CSS variable declaration with indentation
      // Example: "  --color-base-black: #000000;"
      return `  ${varName}: ${token.value};`;
    })
    .join('\n');

  return `/**\n * Do not edit directly, this file was auto-generated.\n */\n:root {\n${tokens}\n}\n`;
};

/**
 * Token file loading strategy:
 * 
 * 1. Always loads base tokens (base.json, global.json)
 * 2. Loads mode-specific button tokens (button-light.json or button-dark.json)
 * 3. Tries to load brand-specific tokens for the mode (brand-{brand}-{mode}.json)
 * 4. Falls back to generic brand tokens (brand-{brand}.json) if mode-specific doesn't exist
 * 5. Loads shared tokens (semantic, text, spacing, etc.)
 * 
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @param {string} mode - The color scheme ('light' or 'dark')
 * @returns {Object} Style Dictionary configuration object
 * 
 * @example
 * const config = getStyleDictionaryConfig('startribune', 'light');
 * // Returns config that will generate startribune-light.css
 */
function getStyleDictionaryConfig(brand, mode) {
  const sourceFiles = [
    'tokens/color/base.json',           // Base colors (black, white)
    'tokens/color/global.json',         // Global color palettes (neutral, red, blue, etc.)
    `tokens/color/button-${mode}.json`, // Mode-specific button tokens (light or dark)
  ];

  // Add brand-specific file - must exist for the requested mode
  const fs = require('fs');
  const path = require('path');
  
  const brandFile = `tokens/color/brand-${brand}-${mode}.json`;
  const brandFilePath = path.join(process.cwd(), brandFile);

  // Require the exact brand/mode file to exist
  // If it doesn't exist, fail fast - this is a build-time error
  if (fs.existsSync(brandFilePath)) {
    sourceFiles.push(brandFile);
  } else {
    console.error(
      `❌ Error: Required token file not found: ${brandFile}\n` +
      `   Expected file: tokens/color/brand-${brand}-${mode}.json\n` +
      `   All brand/mode combinations must have corresponding token files.`
    );
    throw new Error(`Missing required token file: ${brandFile}`);
  }

  // Add shared token files that apply to all brands and modes
  sourceFiles.push(
    'tokens/color/semantic.json',  
    'tokens/text.json',            
    'tokens/border-radius.json',   
    'tokens/spacing.json',         
    'tokens/breakpoint.json'       
  );

  // Return Style Dictionary configuration
  return {
    // Verbose logging helps debug token resolution issues
    log: { verbosity: 'verbose' },
    
    // Source files to read tokens from (in order - later files can override earlier ones)
    source: sourceFiles,
    
    // Custom format registration
    // This tells Style Dictionary to use our custom cssVariablesFormat function
    hooks: {
      formats: {
        'css/variables': cssVariablesFormat,
      },
    },
    
    // Platform configuration - defines output format and location
    platforms: {
      css: {
        // Use CSS transform group - handles token reference resolution
        // This automatically resolves {color.neutral.500} references to actual hex values
        transformGroup: 'css',
        
        // Output directory for generated CSS files
        buildPath: `dist/themes/`,
        
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
    },
  };
}

/**
 * Main Build Function
 * 
 * Orchestrates the token building process for all brands and color schemes.
 * Generates CSS files for each combination:
 * - startribune + light → startribune-light.css
 * - startribune + dark → startribune-dark.css
 * - varsity + light → varsity-light.css
 * - varsity + dark → varsity-dark.css
 * 
 * Process:
 * 1. Iterates through all brand/mode combinations
 * 2. Creates Style Dictionary configuration for each
 * 3. Builds CSS file using Style Dictionary
 * 4. Logs progress and completion
 * 
 * @returns {Promise<void>} Resolves when all tokens are built
 * @throws {Error} If any build fails, the process exits with error code 1
 */
async function buildTokens() {
  console.log('Building design tokens...\n');

  const brands = ['startribune', 'varsity'];
  const modes = ['light', 'dark'];

  // Build tokens for each brand/mode combination
  for (const brand of brands) {
    for (const mode of modes) {
      console.log(`\n==============================================`);
      console.log(`Processing: ${brand}-${mode}`);

      // Get configuration for this specific brand/mode combination
      const config = getStyleDictionaryConfig(brand, mode);
      
      // Create Style Dictionary instance with the configuration
      const sd = new StyleDictionary(config);
      
      // Build all platforms (in this case, just CSS)
      // This reads token files, resolves references, and generates the CSS file
      await sd.buildAllPlatforms();

      console.log(`✓ ${brand}-${mode} tokens built`);
    }
  }

  console.log('\n==============================================');
  console.log('\n✓ All tokens built successfully!\n');
}

// Execute the build function
// If any error occurs, log it and exit with error code 1
// This ensures CI/CD pipelines fail if token generation fails
buildTokens().catch((error) => {
  console.error('Error building tokens:', error);
  process.exit(1);
});


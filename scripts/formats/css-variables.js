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
function cssVariablesFormat({ dictionary }) {
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
}

module.exports = cssVariablesFormat;


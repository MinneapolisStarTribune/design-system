const StyleDictionary = require('style-dictionary').default;
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Custom TypeScript formatter for Mantine themes
 * Converts design tokens into Mantine-compatible color objects
 */
const mantineTypeScriptFormat = ({ dictionary, options = {} }) => {
  const { brand, mode } = options;
  
  // Group tokens by their path structure
  const colorTokens = {};
  const paletteTokens = {}; // For color palettes (e.g., neutral.50, neutral.100, etc.)
  
  dictionary.allTokens.forEach((token) => {
    const path = token.path;
    
    // Skip non-color tokens
    if (path[0] !== 'color') return;
    
    // Get the resolved value (Style Dictionary should have resolved references)
    const value = token.value;
    
    // Handle color palettes (e.g., color.neutral.50)
    if (path.length === 3 && /^\d+$/.test(path[2])) {
      const paletteName = path[1]; // e.g., "neutral"
      const shade = path[2]; // e.g., "50"
      
      if (!paletteTokens[paletteName]) {
        paletteTokens[paletteName] = {};
      }
      paletteTokens[paletteName][shade] = value;
      return;
    }
    
    // Handle semantic tokens (e.g., color.control.brand-background)
    // Convert path to kebab-case key (Mantine uses kebab-case for custom colors)
    const key = path.slice(1).join('-');
    colorTokens[key] = value;
  });
  
  // Convert palette tokens to Mantine color arrays (only use what exists in token files)
  const mantinePalettes = {};
  Object.keys(paletteTokens).forEach((paletteName) => {
    const shades = paletteTokens[paletteName];
    // Include all available shades from token files, ordered by shade value
    // Map shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, etc.
    const mantineArray = [];
    const shadeOrder = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    
    shadeOrder.forEach((shade) => {
      if (shades[shade]) {
        mantineArray.push(shades[shade]);
      }
      // Do not add any colors that don't exist in token files
    });
    
    // Include any other shades that might exist (sorted numerically)
    const allShades = Object.keys(shades).sort((a, b) => parseInt(a) - parseInt(b));
    allShades.forEach((shade) => {
      if (!shadeOrder.includes(shade) && shades[shade]) {
        mantineArray.push(shades[shade]);
      }
    });
    
    // Informational message if palette has fewer than 10 colors (Mantine typically uses 10)
    if (mantineArray.length < 10) {
      console.warn(
        `⚠️  Warning: Palette "${paletteName}" has ${mantineArray.length} colors. ` +
        `Mantine typically uses 10 colors (indices 0-9), but this palette will work with ${mantineArray.length} colors. ` +
        `If you need more shades, add them to your token files (global.json or brand-${brand}-${mode}.json).`
      );
    }
    
    mantinePalettes[paletteName] = mantineArray;
  });
  
  // Generate TypeScript code
  const indent = (level) => '  '.repeat(level);
  const keyStr = (name) =>
    /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name) ? name : `'${name}'`;

  let code = `/**\n * Do not edit directly, this file was auto-generated.\n`;
  code += ` * Generated from: ${brand}-${mode} tokens\n`;
  code += ` * Date: generated at build time\n */\n\n`;
  code += `export const colors = {\n`;

  // Output palettes first (sorted)
  Object.keys(mantinePalettes).sort().forEach((paletteName) => {
    code += `${indent(1)}${keyStr(paletteName)}: [\n`;
    mantinePalettes[paletteName].forEach((color, index) => {
      code += `${indent(2)}'${color}'${index < mantinePalettes[paletteName].length - 1 ? ',' : ''}\n`;
    });
    code += `${indent(1)}],\n`;
  });

  // Output semantic tokens - only include if they're already arrays or valid color values
  // Do not generate additional colors
  Object.keys(colorTokens).sort().forEach((key) => {
    const value = colorTokens[key];

    // If value is already an array (shouldn't happen from tokens, but check anyway)
    if (Array.isArray(value)) {
      // No length restriction - use whatever is provided
      if (value.length === 1) {
        code += `${indent(1)}${keyStr(key)}: ['${value[0]}'],\n`;
      } else {
        code += `${indent(1)}${keyStr(key)}: [\n`;
        value.forEach((color, index) => {
          code += `${indent(2)}'${color}'${index < value.length - 1 ? ',' : ''}\n`;
        });
        code += `${indent(1)}],\n`;
      }
    } else if (typeof value === 'string') {
      // Single color value - Mantine needs arrays, so we'll use a single-element array
      // and warn the developer
      console.warn(
        `⚠️  Warning: Semantic token "${key}" is a single color value ("${value}"). ` +
        `Mantine typically uses color arrays. This token will be available as a single-element array but may not work correctly with Mantine components that expect multiple shades. ` +
        `Please provide a full color array in your token files (global.json or brand-${brand}-${mode}.json).`
      );
      code += `${indent(1)}${keyStr(key)}: ['${value}'],\n`;
    }
  });
  
  code += `} as const;\n\n`;
  code += `export type Colors = typeof colors;\n`;
  
  return code;
};

/**
 * Transform to resolve color references
 * This will be handled by Style Dictionary's built-in transforms
 */
const resolveColorReference = {
  type: 'value',
  matcher: (token) => {
    return token.value && typeof token.value === 'string' && token.value.startsWith('{color.');
  },
  transform: (token) => {
    // Style Dictionary should resolve these automatically
    // This is a placeholder for custom resolution if needed
    return token.value;
  },
};

/**
 * Get Style Dictionary configuration for a specific brand and mode
 */
function getStyleDictionaryConfig(brand, mode) {
  // Only use colors from global.json, button files, and brand-specific files
  const sourceFiles = [
    'tokens/color/global.json',
    `tokens/color/button-${mode}.json`,
  ];
  
  // Add brand-specific file
  const brandFile = `tokens/color/brand-${brand}-${mode}.json`;
  const brandFileFallback = `tokens/color/brand-${brand}.json`;
  
  if (fs.existsSync(path.join(process.cwd(), brandFile))) {
    sourceFiles.push(brandFile);
  } else if (fs.existsSync(path.join(process.cwd(), brandFileFallback))) {
    sourceFiles.push(brandFileFallback);
  } else {
    console.warn(`Warning: No token file found for ${brand}-${mode}, skipping...`);
    return null;
  }
  
  return {
    log: { verbosity: 'verbose' },
    source: sourceFiles,
    platforms: {
      typescript: {
        transformGroup: 'css', // Use CSS transform group to resolve references
        buildPath: 'src/generated/themes/',
        files: [
          {
            destination: `${brand}.${mode}.ts`,
            format: 'typescript/mantine',
            options: {
              brand,
              mode,
            },
          },
        ],
      },
    },
  };
}

/**
 * Register custom format
 * Style Dictionary v4 uses a different API
 */
StyleDictionary.registerFormat({
  name: 'typescript/mantine',
  format: mantineTypeScriptFormat,
});

/**
 * Main build function
 */
async function buildMantineTokens() {
  console.log('Building Mantine theme tokens...\n');
  
  const brands = ['startribune', 'varsity'];
  const modes = ['light', 'dark'];
  
  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), 'src/generated/themes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const hashBefore = hashThemeOutputs(outputDir, brands, modes);

  for (const brand of brands) {
    for (const mode of modes) {
      console.log(`\n==============================================`);
      console.log(`Processing: ${brand}-${mode}`);
      
      const config = getStyleDictionaryConfig(brand, mode);
      if (!config) {
        console.log(`⚠ Skipping ${brand}-${mode} (file not found)`);
        continue;
      }
      
      try {
        const sd = new StyleDictionary(config);
        await sd.buildAllPlatforms();
        console.log(`✓ ${brand}.${mode}.ts generated`);
      } catch (error) {
        console.error(`✗ Error building ${brand}-${mode}:`, error.message);
      }
    }
  }

  const hashAfter = hashThemeOutputs(outputDir, brands, modes);
  const outputsChanged = hashBefore !== hashAfter;

  // Only write build info when generated theme files actually changed
  if (outputsChanged) {
    const generatedDir = path.join(process.cwd(), 'src/generated');
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }
    const pkg = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
    );
    const buildTime = new Date().toISOString();
    const buildInfoContent = `/**
 * Do not edit directly, this file was auto-generated.
 * Build time and package version for this design-system build.
 */
export const buildInfo = {
  buildTime: '${buildTime}',
  version: '${pkg.version}',
} as const;
`;
    fs.writeFileSync(
      path.join(generatedDir, 'build-info.ts'),
      buildInfoContent,
      'utf8'
    );
    console.log('✓ build-info.ts updated (theme output changed)');
  } else {
    console.log('✓ build-info.ts unchanged (no theme changes)');
  }

  console.log('\n==============================================');
  console.log('\n✓ All Mantine tokens built successfully!\n');
}

/** Returns a hash of generated theme file contents, or null if any file is missing */
function hashThemeOutputs(outputDir, brands, modes) {
  const files = brands.flatMap((brand) =>
    modes.map((mode) => `${brand}.${mode}.ts`)
  );
  let concat = '';
  for (const file of files) {
    const filePath = path.join(outputDir, file);
    if (!fs.existsSync(filePath)) return null;
    concat += fs.readFileSync(filePath, 'utf8');
  }
  return crypto.createHash('sha256').update(concat).digest('hex');
}

buildMantineTokens().catch((error) => {
  console.error('Error building Mantine tokens:', error);
  process.exit(1);
});


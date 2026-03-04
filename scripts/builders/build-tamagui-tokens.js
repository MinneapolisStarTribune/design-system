const StyleDictionary = require('style-dictionary').default;
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Custom TypeScript formatter for Tamagui themes
 * Converts design tokens into Tamagui-compatible color objects
 */
const tamaguiTypeScriptFormat = ({ dictionary, options = {} }) => {
  const { brand, mode } = options;
  
  // Collect all color tokens - just use whatever Style Dictionary gives us
  const colorTokens = {};
  
  dictionary.allTokens.forEach((token) => {
    const tokenPath = token.path;
    const value = token.value;
    
    // Convert path to kebab-case key (e.g., ['color', 'background', 'light-default'] -> 'background-light-default')
    // or ['color', 'neutral', '50'] -> 'neutral-50'
    const key = tokenPath.slice(1).join('-');
    
    // Style Dictionary resolves all token values to strings (hex, rgb, etc.)
    // Store as string if it's a non-empty string value
    if (typeof value === 'string' && value.trim().length > 0) {
      colorTokens[key] = value;
    }
  });
  
  // Generate TypeScript code
  const indent = (level) => '  '.repeat(level);
  const keyStr = (name) =>
    /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name) ? name : `'${name}'`;

  let code = `/**\n * Do not edit directly, this file was auto-generated.\n`;
  code += ` * Generated from: ${brand}-${mode} tokens\n`;
  code += ` * Date: generated at build time\n */\n\n`;
  code += `export const colors = {\n`;

  // Output all color tokens as strings, sorted alphabetically
  Object.keys(colorTokens).sort().forEach((key) => {
    code += `${indent(1)}${keyStr(key)}: '${colorTokens[key]}',\n`;
  });
  
  code += `} as const;\n\n`;
  code += `export type Colors = typeof colors;\n`;
  
  return code;
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
            format: 'typescript/tamagui',
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
  name: 'typescript/tamagui',
  format: tamaguiTypeScriptFormat,
});

/**
 * Main build function
 */
async function buildTamaguiTokens() {
  console.log('Building Tamagui theme tokens...\n');
  
  const brands = ['startribune', 'varsity'];
  const modes = ['light', 'dark'];
  
  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), 'src/generated/themes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Hash of current token source contents (used to decide whether to update build-info.ts)
  const currentTokenHash = hashTokenSources();
  let hasErrors = false;

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
        hasErrors = true;
        // Continue processing other themes, but mark that we had errors
      }
    }
  }

  // Fail build if any theme generation failed
  if (hasErrors) {
    throw new Error('One or more theme files failed to generate');
  }

  const generatedDir = path.join(process.cwd(), 'src/generated');
  const buildInfoPath = path.join(generatedDir, 'build-info.ts');
  const lastTokenHash = readTokenHashFromBuildInfo(buildInfoPath);

  // Only write build-info when token sources changed (new or updated tokens)
  // Handle null case (first build or hash calculation failed)
  if (currentTokenHash !== null && currentTokenHash !== lastTokenHash) {
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
 * Only regenerated when token sources change (tokens/color/*.json, etc.).
 */
export const buildInfo = {
  buildTime: '${buildTime}',
  version: '${pkg.version}',
  tokenSourceHash: '${currentTokenHash}',
} as const;
`;
    fs.writeFileSync(buildInfoPath, buildInfoContent, 'utf8');
    console.log('✓ build-info.ts updated (token sources changed)');
  } else {
    console.log('✓ build-info.ts unchanged (same token sources)');
  }

  console.log('\n==============================================');
  console.log('\n✓ All Tamagui tokens built successfully!\n');
}

/** Token source files that affect theme output (derived from tokens/ to stay in sync with getStyleDictionaryConfig) */
function getTokenSourceFiles() {
  const cwd = process.cwd();
  const colorDir = path.join(cwd, 'tokens/color');
  const sharedNames = ['text.json', 'border-radius.json', 'spacing.json', 'breakpoint.json'];

  if (!fs.existsSync(colorDir)) return [];

  const colorFiles = fs.readdirSync(colorDir).filter((f) => f.endsWith('.json'));
  const colorPaths = colorFiles
    .sort()
    .map((f) => path.join('tokens', 'color', f));
  const sharedPaths = sharedNames
    .filter((f) => fs.existsSync(path.join(cwd, 'tokens', f)))
    .map((f) => path.join('tokens', f));

  return [...colorPaths, ...sharedPaths];
}

/** Hash of token source file contents. Changes only when token definitions change. */
function hashTokenSources() {
  const cwd = process.cwd();
  const sourceFiles = getTokenSourceFiles();

  // Return null if no source files found
  if (sourceFiles.length === 0) {
    return null;
  }

  let concat = '';
  for (const file of sourceFiles) {
    const filePath = path.join(cwd, file);
    if (!fs.existsSync(filePath)) {
      // Log warning but continue with other files
      console.warn(`Warning: Token source file not found: ${file}`);
      continue;
    }
    concat += fs.readFileSync(filePath, 'utf8');
  }

  // Return null if no content was read (all files missing)
  if (concat.length === 0) {
    return null;
  }

  return crypto.createHash('sha256').update(concat).digest('hex');
}

/** Read tokenSourceHash from existing build-info.ts, or null if missing/different format */
function readTokenHashFromBuildInfo(buildInfoPath) {
  if (!fs.existsSync(buildInfoPath)) return null;
  const content = fs.readFileSync(buildInfoPath, 'utf8');
  const m = content.match(/tokenSourceHash:\s*'([^']+)'/);
  return m ? m[1] : null;
}

buildTamaguiTokens().catch((error) => {
  console.error('Error building Tamagui tokens:', error);
  process.exit(1);
});

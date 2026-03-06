const fs = require('fs');
const path = require('path');

const TYPOGRAPHY_DIR_PREFIX = 'tokens/typography';
const OUT_DIR_PREFIX = 'dist/mobile/typography';

/**
 * Convert kebab-case to camelCase
 */
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/** Base font size for rem-to-px conversion (matches web) */
const REM_BASE = 16;

/**
 * Convert CSS values to React Native compatible values.
 * Outputs fontSize, fontWeight, lineHeight, letterSpacing as numbers (like web CSS).
 */
function convertValue(prop, value) {
  // Convert fontSize: "17px" -> 17, "1.75rem" -> 28 (rem * REM_BASE)
  if (prop === 'fontSize') {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      if (value.endsWith('px')) return parseFloat(value) || value;
      if (value.endsWith('rem')) return Math.round(parseFloat(value) * REM_BASE) || value;
      const num = parseFloat(value);
      return Number.isNaN(num) ? value : num;
    }
    return value;
  }
  // Convert fontWeight: "700" -> 700, "500" -> 500
  if (prop === 'fontWeight') {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return Number.isNaN(num) ? value : num;
    }
    return value;
  }
  // Convert lineHeight from string to number (e.g. "1.32" -> 1.32)
  if (prop === 'lineHeight' && typeof value === 'string') {
    const num = parseFloat(value);
    return Number.isNaN(num) ? value : num;
  }
  // Convert letterSpacing from string to number (e.g. "0.01em" -> 0.01)
  if (prop === 'letterSpacing' && typeof value === 'string') {
    const num = parseFloat(value);
    return Number.isNaN(num) ? value : num;
  }
  // Keep other values as-is
  return value;
}

/**
 * Process typography tokens and create convenient structure
 * Strips desktop/tablet/mobile selectors and converts to camelCase properties
 */
function processTypographyTokens(typographyData) {
  const result = {};
  
  function traverse(obj, path = []) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return;
    }
    
    // Check if this object has breakpoint selectors (desktop, tablet, mobile)
    const hasBreakpoints = obj.mobile || obj.desktop || obj.tablet;
    
    if (hasBreakpoints) {
      // Extract mobile value (prefers mobile, falls back to direct value)
      let valueObj = null;
      if (obj.mobile && obj.mobile.value) {
        valueObj = obj.mobile.value;
      } else if (obj.value && typeof obj.value === 'object') {
        valueObj = obj.value;
      }
      
      if (valueObj && typeof valueObj === 'object') {
        // Convert CSS properties to React Native style properties
        const styleProps = {};
        Object.entries(valueObj).forEach(([cssProp, value]) => {
          const propName = toCamelCase(cssProp);
          styleProps[propName] = convertValue(propName, value);
        });
        
        // Create nested structure: typography.articleBody.bold = { fontFamily, fontSize, ... }
        // Skip "typography" from path (it's the root)
        let current = result;
        for (let i = 1; i < path.length; i++) {
          const key = toCamelCase(path[i]);
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
        
        // Store style props at current level
        Object.assign(current, styleProps);
      }
      return;
    }
    
    // Check if this is a direct value object (no breakpoint selectors)
    // e.g., typography.article-body.h1.value (no desktop/mobile)
    if (obj.value && typeof obj.value === 'object' && !obj.mobile && !obj.desktop && !obj.tablet) {
      const styleProps = {};
      Object.entries(obj.value).forEach(([cssProp, value]) => {
        const propName = toCamelCase(cssProp);
        styleProps[propName] = convertValue(propName, value);
      });
      
      // Create nested structure (skip "typography" from path)
      let current = result;
      for (let i = 1; i < path.length; i++) {
        const key = toCamelCase(path[i]);
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
      
      // Store style props at current level
      Object.assign(current, styleProps);
      return;
    }
    
    // Continue traversing (skip breakpoint selectors and value)
    Object.keys(obj).forEach((key) => {
      if (!['desktop', 'tablet', 'mobile', 'value'].includes(key)) {
        traverse(obj[key], [...path, key]);
      }
    });
  }
  
  traverse(typographyData, []);
  return result;
}

/**
 * Build mobile typography tokens from typography token files
 *
 * Reads typography definitions and outputs JavaScript files with
 * typography information for React Native consumption. Strips desktop/tablet/mobile
 * selectors and prefers mobile values.
 *
 * @param {string} brand - The brand name ('startribune' or 'varsity')
 * @returns {Promise<void>}
 */
async function buildMobileTypography(brand) {
  console.log(`\nBuilding mobile typography tokens for ${brand}...`);

  // Load editorial typography
  const editorialPath = path.join(process.cwd(), `${TYPOGRAPHY_DIR_PREFIX}/editorial/${brand}.json`);
  let editorialData = {};
  if (fs.existsSync(editorialPath)) {
    editorialData = JSON.parse(fs.readFileSync(editorialPath, 'utf8'));
  }

  // Load utility typography (shared + brand overrides)
  const utilitySharedPath = path.join(process.cwd(), `${TYPOGRAPHY_DIR_PREFIX}/utility/shared.json`);
  const utilityBrandPath = path.join(process.cwd(), `${TYPOGRAPHY_DIR_PREFIX}/utility/${brand}.json`);
  
  let utilityData = {};
  if (fs.existsSync(utilitySharedPath)) {
    utilityData = JSON.parse(fs.readFileSync(utilitySharedPath, 'utf8'));
  }
  if (fs.existsSync(utilityBrandPath)) {
    const brandData = JSON.parse(fs.readFileSync(utilityBrandPath, 'utf8'));
    // Merge brand overrides into shared (brand takes precedence)
    utilityData = {
      ...utilityData,
      typography: {
        ...utilityData.typography,
        ...brandData.typography,
      },
    };
  }

  // Combine all typography data
  const allTypographyData = {
    typography: {
      ...(editorialData.typography || {}),
      ...(utilityData.typography || {}),
    },
  };

  // Process typography tokens
  const typographyTokens = processTypographyTokens(allTypographyData);

  // Generate JavaScript file
  const jsContent = `/**
 * Do not edit directly. Generated from typography token files
 * Mobile typography tokens for React Native
 */

export default ${JSON.stringify(typographyTokens, null, 2)};
`;

  // Ensure output directory exists
  const outDir = path.join(process.cwd(), OUT_DIR_PREFIX);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Write JavaScript file
  const jsPath = path.join(outDir, `${brand}-typography.js`);
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log(`✓ ${brand} mobile typography built → ${OUT_DIR_PREFIX}/${brand}-typography.js`);
}

module.exports = buildMobileTypography;

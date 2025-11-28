import baseColorsJson from '../../../../tokens/color/base.json';
import globalColorsJson from '../../../../tokens/color/global.json';

export interface BrandColorData {
  name: string;
  tokenName: string; // Original kebab-case token name (e.g., "on-light-subtle-01")
  value: string;
  description?: string;
  tokenReference?: string;
}

export interface BrandColorCategory {
  name: string;
  description?: string;
  overview?: string[];
  colors: BrandColorData[];
}

// Helper function to resolve a single token reference like "{color.base.white}" to actual value
function resolveSingleTokenReference(ref: string): string {
  if (!ref.startsWith('{') || !ref.endsWith('}')) {
    return ref; // Not a token reference, return as-is
  }

  // Remove braces: "{color.base.white}" -> "color.base.white"
  const path = ref.slice(1, -1).split('.');

  // Navigate through the JSON structure
  let current: any = { color: { ...baseColorsJson.color, ...globalColorsJson.color } };

  for (const segment of path) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment];
    } else {
      return ref; // Path not found, return original reference
    }
  }

  // If we found a token object with a value, return it
  if (current && typeof current === 'object' && 'value' in current) {
    // If the value is another reference, resolve it recursively
    if (typeof current.value === 'string' && current.value.startsWith('{')) {
      return resolveSingleTokenReference(current.value);
    }
    return current.value;
  }

  return ref; // Fallback to original reference
}

// Helper function to resolve token references like "{color.base.white}" to actual values
// Also handles token references embedded in strings (e.g., gradients)
function resolveTokenReference(ref: string): string {
  // If it's a simple token reference (starts and ends with braces), resolve it directly
  if (ref.startsWith('{') && ref.endsWith('}')) {
    return resolveSingleTokenReference(ref);
  }

  // Otherwise, look for token references within the string (e.g., in gradients)
  // Pattern: {word.word.word} or {word.word.word.number}
  const tokenPattern = /\{([^}]+)\}/g;

  return ref.replace(tokenPattern, (match) => {
    return resolveSingleTokenReference(match);
  });
}

// Helper function to format a key name (e.g., "light-default" -> "Light Default")
function formatColorName(key: string): string {
  return key
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to format a category name (e.g., "background" -> "Background")
function formatCategoryName(key: string): string {
  return key
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Process a color category (e.g., background, text)
function processColorCategory(
  categoryName: string,
  categoryData: Record<string, any>,
  skipKeys: string[] = []
): BrandColorData[] {
  const colors: BrandColorData[] = [];

  Object.entries(categoryData).forEach(([key, token]: [string, any]) => {
    // Skip specified keys (like "dark-mode" which we handle separately)
    if (skipKeys.includes(key) || typeof token !== 'object' || !token.value) {
      return;
    }

    const resolvedValue = resolveTokenReference(token.value);
    colors.push({
      name: formatColorName(key),
      tokenName: `${categoryName}-${key}`, // Prepend category name (e.g., "text-on-light-primary")
      value: resolvedValue,
      description: token.description,
      tokenReference: token.value,
    });
  });

  return colors;
}

// Main function to process brand colors from a brand JSON file
export function processBrandColors(brandJson: any): BrandColorCategory[] {
  const categories: BrandColorCategory[] = [];
  const colorData = brandJson?.color;

  if (!colorData) {
    return categories;
  }

  // Process each top-level category (e.g., "background", "text", "brand")
  Object.entries(colorData).forEach(([categoryKey, categoryValue]: [string, any]) => {
    if (typeof categoryValue !== 'object' || categoryValue === null) {
      return;
    }

    // Check if this category has a "dark-mode" subcategory, description, or overview
    const hasDarkMode = 'dark-mode' in categoryValue;
    const categoryDescription = categoryValue.$description || categoryValue.description;
    const categoryOverview = categoryValue.overview;

    // Process the main category colors (skip dark-mode, description, and overview fields)
    const skipKeys = hasDarkMode ? ['dark-mode'] : [];
    if (categoryDescription) {
      skipKeys.push('$description', 'description');
    }
    if (categoryOverview) {
      skipKeys.push('overview');
    }
    const colors = processColorCategory(categoryKey, categoryValue, skipKeys);

    if (colors.length > 0) {
      categories.push({
        name: formatCategoryName(categoryKey),
        description: categoryDescription,
        overview: categoryOverview,
        colors,
      });
    }

    // Process dark-mode colors if they exist
    if (hasDarkMode && categoryValue['dark-mode']) {
      const darkModeColors = processColorCategory(categoryKey, categoryValue['dark-mode'], []);

      if (darkModeColors.length > 0) {
        // Dark mode categories can have their own description/overview or inherit from parent
        const darkModeDescription =
          categoryValue['dark-mode'].$description ||
          categoryValue['dark-mode'].description ||
          categoryDescription;
        const darkModeOverview = categoryValue['dark-mode'].overview || categoryOverview;
        categories.push({
          name: `${formatCategoryName(categoryKey)} (Dark Mode)`,
          description: darkModeDescription,
          overview: darkModeOverview,
          colors: darkModeColors,
        });
      }
    }
  });

  return categories;
}

// Import brand JSON files
import startribuneBrandJson from '../../../../tokens/color/brand-startribune.json';
import varsityBrandJson from '../../../../tokens/color/brand-varsity.json';

// Helper function to load and process a brand by name
export function getBrandColors(brandName: string): BrandColorCategory[] {
  let brandJson: any;

  if (brandName === 'startribune') {
    brandJson = startribuneBrandJson;
  } else if (brandName === 'varsity') {
    brandJson = varsityBrandJson;
  } else {
    console.warn(`Unknown brand: ${brandName}`);
    return [];
  }

  return processBrandColors(brandJson);
}

// Export processed colors for startribune (for backward compatibility)
export const startribuneColorCategories = processBrandColors(startribuneBrandJson);
export const varsityColorCategories = processBrandColors(varsityBrandJson);

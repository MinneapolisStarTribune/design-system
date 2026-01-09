// @ts-nocheck
/**
 * ⚠️ IMPORTANT: This file is ONLY for displaying colors in Storybook documentation.
 *
 * This file is NOT used in production code. It processes color tokens from JSON files
 * to create data structures used by Storybook stories for displaying color palettes.
 *
 * For production code, colors should be accessed through the Mantine theme system
 * via useMantineTheme() or the DesignSystemProvider, which properly handles
 * brand-specific and theme-aware color resolution.
 */
import React, { useMemo, useEffect, useState } from 'react';
import { useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { Brand, ColorScheme } from '../../../providers/theme-helpers';

// Import token JSON files for descriptions
import startribuneLightJson from '../../../../tokens/color/brand-startribune-light.json';
import startribuneDarkJson from '../../../../tokens/color/brand-startribune-dark.json';
import varsityLightJson from '../../../../tokens/color/brand-varsity-light.json';
import varsityDarkJson from '../../../../tokens/color/brand-varsity-dark.json';

export type ColorCategory =
  | 'background'
  | 'text'
  | 'brand'
  | 'border'
  | 'control'
  | 'icon'
  | 'overlay'
  | 'semantic'
  | 'button';

interface ColorDisplay {
  name: string;
  tokenName: string;
  value: string;
  description?: string;
}

interface ThemeAwareColorCategoryProps {
  category: ColorCategory;
  categoryDisplayName?: string;
  groupBy?: (colorKey: string) => string | null; // Optional grouping function
}

// Helper function to format a key name (e.g., "light-default" -> "Light Default")
function formatColorName(key: string): string {
  return key
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get category description and overview from token JSON files
 */
function getCategoryMetadata(
  brand: Brand,
  colorScheme: ColorScheme,
  category: string
): { description?: string; overview?: string[] } {
  let brandJson: any;

  if (brand === 'startribune') {
    brandJson = colorScheme === 'light' ? startribuneLightJson : startribuneDarkJson;
  } else if (brand === 'varsity') {
    brandJson = colorScheme === 'light' ? varsityLightJson : varsityDarkJson;
  } else {
    return {};
  }

  const categoryData = brandJson?.color?.[category];
  if (!categoryData || typeof categoryData !== 'object') {
    return {};
  }

  return {
    description: categoryData.description || categoryData.$description,
    overview: categoryData.overview,
  };
}

/**
 * Get color descriptions from token JSON files
 */
function getColorDescriptions(
  brand: Brand,
  colorScheme: ColorScheme,
  category: string
): Record<string, string> {
  let brandJson: any;

  if (brand === 'startribune') {
    brandJson = colorScheme === 'light' ? startribuneLightJson : startribuneDarkJson;
  } else if (brand === 'varsity') {
    brandJson = colorScheme === 'light' ? varsityLightJson : varsityDarkJson;
  } else {
    return {};
  }

  const categoryData = brandJson?.color?.[category];
  if (!categoryData || typeof categoryData !== 'object') {
    return {};
  }

  const descriptions: Record<string, string> = {};

  Object.entries(categoryData).forEach(([key, token]: [string, any]) => {
    // Skip metadata fields
    if (
      key === '$description' ||
      key === 'description' ||
      key === 'overview' ||
      key === 'dark-mode'
    ) {
      return;
    }

    if (token && typeof token === 'object' && token.description) {
      descriptions[key] = token.description;
    }
  });

  return descriptions;
}

export const ThemeAwareColorCategory: React.FC<ThemeAwareColorCategoryProps> = ({
  category,
  categoryDisplayName,
  groupBy,
}) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Read brand from Storybook's globals synchronously on mount, then poll for changes
  const getBrandFromGlobals = (): Brand => {
    try {
      const parent = window.parent;
      if (parent && parent !== window) {
        const globals = (parent as any).__STORYBOOK_GLOBALS__;
        if (globals?.brand) {
          return globals.brand as Brand;
        }
      } else {
        const globals = (window as any).__STORYBOOK_GLOBALS__;
        if (globals?.brand) {
          return globals.brand as Brand;
        }
      }
    } catch (e) {
      // Ignore errors
    }
    return 'startribune'; // Default fallback
  };

  const [brand, setBrand] = useState<Brand>(getBrandFromGlobals);

  // Poll for brand changes (Storybook updates globals when toolbar changes)
  useEffect(() => {
    const interval = setInterval(() => {
      const newBrand = getBrandFromGlobals();
      setBrand((current) => (current !== newBrand ? newBrand : current));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const categoryMetadata = useMemo(
    () => getCategoryMetadata(brand, colorScheme as ColorScheme, category),
    [brand, colorScheme, category]
  );

  // Compute colors from theme (independent of brand - brand only affects descriptions)
  const colors = useMemo(() => {
    if (!theme || !theme.colors) {
      return [];
    }

    const colorList: ColorDisplay[] = [];

    // Special handling for brand colors: they're stored as a direct "brand" array
    // in the theme, not as "brand-01", "brand-02", etc.
    // We ONLY want to show the first 4 colors (01, 02, 03, 04) from this array, not the duplicates
    // (Mantine requires 10 colors, so indices 4-9 are duplicates of brand-04)
    if (category === 'brand' && theme.colors['brand'] && Array.isArray(theme.colors['brand'])) {
      const brandArray = theme.colors['brand'] as string[];
      const brandColorsToShow = brandArray.slice(0, 4);
      brandColorsToShow.forEach((colorValue, index) => {
        const colorKey = String(index + 1).padStart(2, '0'); // 01, 02, 03, 04
        colorList.push({
          name: formatColorName(colorKey),
          tokenName: `brand-${colorKey}`, // Use brand-01, brand-02, etc. for consistency
          value: colorValue,
          description: undefined,
        });
      });
    } else {
      // Get colors from Mantine theme - they're already loaded and resolved!
      const prefix = `${category}-`;
      Object.entries(theme.colors).forEach(([key, colorArray]) => {
        // Match keys like "background-*" for category "background"
        if (key.startsWith(prefix) && Array.isArray(colorArray) && colorArray.length > 0) {
          const colorKey = key.replace(prefix, '');
          const colorValue = colorArray[0];

          colorList.push({
            name: formatColorName(colorKey),
            tokenName: key,
            value: colorValue,
            description: undefined,
          });
        }
      });
    }

    // Sort colors for consistent display
    colorList.sort((a, b) => a.tokenName.localeCompare(b.tokenName));

    return colorList;
  }, [theme, category]);

  // Add descriptions based on brand (this can update separately)
  const colorsWithDescriptions = useMemo(() => {
    const descriptions = getColorDescriptions(brand, colorScheme as ColorScheme, category);
    return colors.map((color) => {
      const colorKey = color.tokenName.replace(`${category}-`, '');
      return {
        ...color,
        description: descriptions[colorKey],
      };
    });
  }, [colors, brand, colorScheme, category]);

  if (!theme || !theme.colors) {
    return (
      <div>
        <p>Loading theme...</p>
      </div>
    );
  }

  const displayName = categoryDisplayName || category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>{displayName} Colors</h1>
        {categoryMetadata.description && (
          <p style={{ marginTop: '0.5rem' }}>{categoryMetadata.description}</p>
        )}
        {categoryMetadata.overview && categoryMetadata.overview.length > 0 && (
          <>
            <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Overview</h2>
            <ul>
              {categoryMetadata.overview.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <p style={{ marginBottom: '1rem' }}>
        Showing {category} colors for <strong>{brand}</strong> in <strong>{colorScheme}</strong>{' '}
        theme. Use the toolbar controls above to switch themes and brands.
      </p>
      {colorsWithDescriptions.length === 0 ? (
        <p>
          No {category} colors found for {colorScheme} theme.
        </p>
      ) : (
        (() => {
          // Render color card component
          const renderColorCard = (color: ColorDisplay) => {
            const isGradient = color.value.startsWith('linear-gradient');
            return (
              <div
                key={color.tokenName}
                style={{
                  border: `1px solid ${theme.colors.gray?.[3] || '#e9ecef'}`,
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    backgroundColor: isGradient ? 'transparent' : color.value,
                    background: isGradient ? color.value : color.value,
                    height: '60px',
                    width: '100%',
                    minHeight: '60px',
                  }}
                />
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{color.name}</div>
                  {color.description && (
                    <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      {color.description}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}
                  >
                    {color.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{color.tokenName}</div>
                </div>
              </div>
            );
          };

          // If grouping is enabled, group colors
          if (groupBy) {
            const groups: Record<string, ColorDisplay[]> = {};
            colorsWithDescriptions.forEach((color) => {
              const colorKey = color.tokenName.replace(`${category}-`, '');
              const groupName = groupBy(colorKey);
              if (groupName) {
                if (!groups[groupName]) {
                  groups[groupName] = [];
                }
                groups[groupName].push(color);
              } else {
                // Colors that don't match any group go in "other"
                if (!groups.other) {
                  groups.other = [];
                }
                groups.other.push(color);
              }
            });

            // Sort groups and colors within groups
            const sortedGroupNames = Object.keys(groups).sort();
            sortedGroupNames.forEach((groupName) => {
              groups[groupName].sort((a, b) => a.tokenName.localeCompare(b.tokenName));
            });

            return (
              <>
                {sortedGroupNames.map((groupName) => {
                  if (groups[groupName].length === 0) return null;
                  return (
                    <div key={groupName} style={{ marginBottom: '2rem' }}>
                      <h3
                        style={{
                          marginBottom: '1rem',
                          textTransform: 'capitalize',
                        }}
                      >
                        {groupName}
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                          gap: '1rem',
                        }}
                      >
                        {groups[groupName].map(renderColorCard)}
                      </div>
                    </div>
                  );
                })}
              </>
            );
          }

          // No grouping - render all colors in one grid
          return (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {colorsWithDescriptions.map(renderColorCard)}
            </div>
          );
        })()
      )}
    </div>
  );
};

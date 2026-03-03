// @ts-nocheck
/**
 * ⚠️ IMPORTANT: This file is ONLY for displaying colors in Storybook documentation.
 *
 * This file is NOT used in production code. It processes design tokens from JSON/TS files
 * to create data structures used by Storybook stories for displaying color palettes.
 *
 * For production code, colors should be accessed through the design system provider
 * and token utilities (e.g., Tamagui + existing token helpers), which properly handle
 * brand-specific and theme-aware color resolution.
 */
import React, { useMemo, useEffect, useState } from 'react';
import { Brand, ColorScheme, getBrandColors } from '../../../providers/theme-helpers';

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

  // Read color scheme from Storybook globals (theme toolbar)
  const getColorSchemeFromGlobals = (): ColorScheme => {
    try {
      const parent = window.parent;
      if (parent && parent !== window) {
        const globals = (parent as any).__STORYBOOK_GLOBALS__;
        if (globals?.theme === 'dark' || globals?.theme === 'light') {
          return globals.theme as ColorScheme;
        }
      } else {
        const globals = (window as any).__STORYBOOK_GLOBALS__;
        if (globals?.theme === 'dark' || globals?.theme === 'light') {
          return globals.theme as ColorScheme;
        }
      }
    } catch (e) {
      // Ignore errors
    }
    return 'light';
  };

  const [colorScheme, setColorScheme] = useState<ColorScheme>(getColorSchemeFromGlobals);

  // Poll for brand changes (Storybook updates globals when toolbar changes)
  useEffect(() => {
    const interval = setInterval(() => {
      const newBrand = getBrandFromGlobals();
      const newScheme = getColorSchemeFromGlobals();
      setBrand((current) => (current !== newBrand ? newBrand : current));
      setColorScheme((current) => (current !== newScheme ? newScheme : current));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const categoryMetadata = useMemo(
    () => getCategoryMetadata(brand, colorScheme, category),
    [brand, colorScheme, category]
  );

  // Compute colors from brand/colorScheme tokens
  const colors = useMemo(() => {
    const brandColors = getBrandColors(brand, colorScheme);
    const colorList: ColorDisplay[] = [];

    // Special handling for brand colors: use brand-01 .. brand-04 tokens directly
    if (category === 'brand') {
      ['01', '02', '03', '04'].forEach((suffix) => {
        const tokenName = `brand-${suffix}`;
        const value = (brandColors as any)[tokenName] as string | undefined;
        if (value) {
          colorList.push({
            name: formatColorName(suffix),
            tokenName,
            value,
            description: undefined,
          });
        }
      });
    } else {
      const prefix = `${category}-`;
      Object.entries(brandColors as Record<string, string>).forEach(([key, colorValue]) => {
        // Match keys like "background-*" for category "background"
        if (key.startsWith(prefix) && typeof colorValue === 'string' && colorValue.length > 0) {
          const colorKey = key.replace(prefix, '');

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
  }, [brand, colorScheme, category]);

  // Add descriptions based on brand (this can update separately)
  const colorsWithDescriptions = useMemo(() => {
    const descriptions = getColorDescriptions(brand, colorScheme, category);
    return colors.map((color) => {
      const colorKey = color.tokenName.replace(`${category}-`, '');
      return {
        ...color,
        description: descriptions[colorKey],
      };
    });
  }, [colors, brand, colorScheme, category]);

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
                  // Use a neutral border color derived from CSS variables (if available),
                  // otherwise fall back to a light gray. This avoids relying on any theme object.
                  border: '1px solid var(--color-border-on-light-subtle-01, #e3e5e8)',
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

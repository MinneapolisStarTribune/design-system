// @ts-nocheck
/**
 * ⚠️ IMPORTANT: This file is ONLY for displaying colors in Storybook documentation.
 *
 * This file is NOT used in production code. It processes design tokens from JSON/TS files
 * to create data structures used by Storybook stories for displaying color palettes.
 *
 * For production code, colors should be accessed through the design system provider
 * and token utilities (e.g., CSS variables on web, useNativeStyles on native), which properly handle
 * brand-specific and theme-aware color resolution.
 */
import React, { useMemo } from 'react';
import type { Brand, ColorScheme } from '../../../providers/theme-helpers';

// Import token JSON files for descriptions
import startribuneLightJson from '../../../../tokens/color/brand-startribune-light.json';
import startribuneDarkJson from '../../../../tokens/color/brand-startribune-dark.json';
import varsityLightJson from '../../../../tokens/color/brand-varsity-light.json';
import varsityDarkJson from '../../../../tokens/color/brand-varsity-dark.json';
import buttonLightJson from '../../../../tokens/color/button-light.json';
import buttonDarkJson from '../../../../tokens/color/button-dark.json';

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

/**
 * Flatten nested button token tree to one level for CSS variable lookup.
 * Handles both shapes: { neutral: { "filled-background": { value } } } and
 * { brand: { filled: { background: { value }, "hover-background": { value } } } }.
 */
function flattenButtonTokens(buttonObj: Record<string, any>): Record<string, { value: string }> {
  const out: Record<string, { value: string }> = {};
  if (!buttonObj || typeof buttonObj !== 'object') return out;

  function walk(node: any, prefix: string) {
    if (!node || typeof node !== 'object') return;
    if ('value' in node && typeof node.value === 'string') {
      out[prefix] = { value: node.value };
      return;
    }
    for (const [key, val] of Object.entries(node)) {
      if (
        key === '$description' ||
        key === 'description' ||
        key === 'overview' ||
        key === 'dark-mode' ||
        key === '_comment'
      )
        continue;
      if (val && typeof val === 'object') {
        walk(val, prefix ? `${prefix}-${key}` : key);
      }
    }
  }

  for (const [variant, variantData] of Object.entries(buttonObj)) {
    if (
      variant === '$description' ||
      variant === 'description' ||
      variant === 'overview' ||
      variant === 'dark-mode'
    )
      continue;
    if (variantData && typeof variantData === 'object') {
      walk(variantData, variant);
    }
  }
  return out;
}

/**
 * Get a brand's color token names from the imported JSON.
 * Returns token names in "category-key" format (e.g., "background-brand").
 * The JSON files have structure: { color: { background: { "brand": { value: "..." }, ... }, ... } }
 *
 * Button tokens come from both brand JSON and button-light/dark JSON; they are merged and
 * flattened so CSS variable names match the built theme (e.g. --color-button-neutral-filled-background).
 *
 * Values are resolved from CSS variables (loaded by ThemeWrapper) rather than raw JSON,
 * since raw JSON contains unresolved references like "{color.emerald-green.800}".
 */
function getBrandColorTokens(brand: Brand, colorScheme: ColorScheme): Record<string, string> {
  let brandJson: any;

  if (brand === 'startribune') {
    brandJson = colorScheme === 'light' ? startribuneLightJson : startribuneDarkJson;
  } else if (brand === 'varsity') {
    brandJson = colorScheme === 'light' ? varsityLightJson : varsityDarkJson;
  } else {
    return {};
  }

  const colorRoot = brandJson?.color;
  if (!colorRoot || typeof colorRoot !== 'object') {
    return {};
  }

  const buttonModeJson = colorScheme === 'light' ? buttonLightJson : buttonDarkJson;
  const brandButton = colorRoot.button;
  const modeButton = buttonModeJson?.color?.button;
  const mergedButton: Record<string, { value: string }> = {
    ...flattenButtonTokens(modeButton || {}),
    ...flattenButtonTokens(brandButton || {}),
  };
  const colorRootWithButton = { ...colorRoot, button: mergedButton };

  const computedStyle = getComputedStyle(document.documentElement);
  const result: Record<string, string> = {};

  // Walk each category (background, text, brand, border, button, etc.)
  for (const [category, categoryData] of Object.entries(colorRootWithButton)) {
    if (!categoryData || typeof categoryData !== 'object') continue;

    // Skip metadata fields
    for (const [key, token] of Object.entries(categoryData as Record<string, any>)) {
      if (
        key === '$description' ||
        key === 'description' ||
        key === 'overview' ||
        key === 'dark-mode'
      )
        continue;

      if (token && typeof token === 'object' && typeof token.value === 'string') {
        const tokenName = `${category}-${key}`;
        // Resolve value from CSS variables (e.g., --color-background-brand, --color-button-neutral-filled-background)
        const cssValue = computedStyle.getPropertyValue(`--color-${tokenName}`).trim();
        if (cssValue) {
          result[tokenName] = cssValue;
        }
      }
    }
  }

  return result;
}

// Helper function to format a key name (e.g., "light-default" -> "Light Default")
function formatColorName(key: string): string {
  return key
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Shared “inline code” look for swatch metadata (Storybook only). */
const swatchCodeBaseStyle = {
  fontFamily: 'monospace',
  padding: '0.15rem 0.4rem',
  borderRadius: '4px',
  backgroundColor: 'rgba(0, 0, 0, 0.06)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
};

/** Resolved value / gradients — may be long; allow breaking. */
const swatchCodeStyle = {
  ...swatchCodeBaseStyle,
  display: 'inline-block' as const,
  maxWidth: '100%',
  wordBreak: 'break-all' as const,
};

/**
 * CSS variable
 */
const swatchTokenCodeStyle = {
  ...swatchCodeBaseStyle,
  display: 'block' as const,
  width: '100%',
  boxSizing: 'border-box' as const,
  maxWidth: '100%',
  fontSize: '0.75rem',
  whiteSpace: 'normal' as const,
  overflowWrap: 'break-word' as const,
  wordBreak: 'normal' as const,
};

const swatchMetaColumnStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
  marginTop: '0.25rem',
};

/** Muted label above each code line (Token vs value — not always hex). */
const swatchRowLabelStyle = {
  fontSize: '0.65rem',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  opacity: 0.65,
  marginBottom: '0.15rem',
};

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
  // Read brand and color scheme from Storybook globals (set by the preview decorator).
  // No polling needed — the decorator re-renders the story tree when globals change.
  const storybookGlobals = (window as any).__STORYBOOK_GLOBALS__ || {};
  const brand = (storybookGlobals.brand || 'startribune') as Brand;
  const colorScheme = (storybookGlobals.theme === 'dark' ? 'dark' : 'light') as ColorScheme;

  const categoryMetadata = useMemo(
    () => getCategoryMetadata(brand, colorScheme, category),
    [brand, colorScheme, category]
  );

  // Compute colors from brand/colorScheme tokens
  const colors = useMemo(() => {
    const brandColors = getBrandColorTokens(brand, colorScheme);
    const colorList: ColorDisplay[] = [];

    // Special handling for brand colors: use brand-01 .. brand-04 tokens directly
    if (category === 'brand') {
      ['01', '02', '03', '04'].forEach((suffix) => {
        const tokenName = `brand-${suffix}`;
        const value = (brandColors as any)[tokenName] as string | undefined;
        if (value) {
          colorList.push({
            name: `Brand ${suffix}`,
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
        {categoryMetadata.description &&
          categoryMetadata.description
            .split(/\n\n+/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((para, i) => (
              <p
                key={i}
                style={{
                  marginTop: i === 0 ? '0.5rem' : '0.75rem',
                  marginBottom: 0,
                }}
              >
                {para}
              </p>
            ))}
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
      <p style={{ marginBottom: '0.5rem' }}>
        Use the toolbar controls above to switch themes and brands. Also see{' '}
        <a href="#using-these-tokens-in-code">using these tokens in code</a> below for CSS and
        examples of implementation.
      </p>
      <p style={{ marginBottom: '1rem' }}>
        Showing {category} colors for <strong>{brand}</strong> in <strong>{colorScheme}</strong>{' '}
        theme.
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
                  <div style={swatchMetaColumnStyle}>
                    <div style={{ minWidth: 0 }}>
                      <div style={swatchRowLabelStyle}>Token</div>
                      <code
                        style={swatchTokenCodeStyle}
                        title="Use in CSS: color, background, border-color, etc."
                      >
                        {`var(--color-${color.tokenName})`}
                      </code>
                    </div>
                    <div>
                      <div style={swatchRowLabelStyle}>Value</div>
                      <code style={{ ...swatchCodeStyle, fontSize: '0.75rem' }}>{color.value}</code>
                    </div>
                  </div>
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

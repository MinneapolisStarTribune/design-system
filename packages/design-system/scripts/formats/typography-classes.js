/**
 * Custom Typography Classes Format
 *
 * This function formats typography tokens into CSS utility classes.
 * It processes composite typography tokens and generates CSS classes with all typography properties.
 * Also adds color property using primary text color tokens based on mode (light/dark).
 *
 * @param {Object} options - Style Dictionary format options
 * @param {Object} options.dictionary - The Style Dictionary token dictionary
 * @param {Object} options.options - Format options (may include brand and mode)
 * @returns {string} Complete CSS file content with typography classes
 *
 * Example output:
 * ```
 * /**
 *  * Do not edit directly, this file was auto-generated.
 *  *\/
 * .typography-utility-page-h1-desktop {
 *   font-family: Nohemi, sans-serif;
 *   font-weight: 600;
 *   font-size: 46px;
 *   line-height: 1.10;
 *   letter-spacing: 0.02em;
 * }
 * 
 * [class*="typography-"] {
 *   color: var(--color-text-on-light-primary);
 * }
 * ```
 */
function typographyClassesFormat({ dictionary, options = {} }) {
  // Access tokens from dictionary.tokens (nested structure)
  // Style Dictionary stores tokens in nested object structure
  const typographyData = dictionary.tokens?.typography;

  if (!typographyData) {
    return '/**\n * Do not edit directly, this file was auto-generated.\n * No typography tokens found.\n */\n';
  }

  // Process nested typography structure manually
  // Structure: typography.utility.page.h1.desktop.value.{font-family, font-size, etc}
  const typographyTokens = [];

  function traverse(obj, path = []) {
    if (obj && typeof obj === 'object') {
      if (obj.value && typeof obj.value === 'object' && !Array.isArray(obj.value)) {
        // This is a composite token with a value object
        // Extract all properties from the value object
        Object.keys(obj.value).forEach(prop => {
          typographyTokens.push({
            path: [...path, 'value', prop],
            value: obj.value[prop],
            originalPath: path
          });
        });
      } else {
        // Continue traversing
        Object.keys(obj).forEach(key => {
          traverse(obj[key], [...path, key]);
        });
      }
    }
  }

  traverse(typographyData, ['typography']);

  if (typographyTokens.length === 0) {
    return '/**\n * Do not edit directly, this file was auto-generated.\n * No typography tokens found.\n */\n';
  }

  // Group tokens by their class name and breakpoint
  const tokenGroups = new Map();

  typographyTokens.forEach((token) => {
    // Token path structure after Style Dictionary processing:
    // ['typography', 'editorial', 'news', 'h1', 'desktop', 'value', 'font-family']
    // or: ['typography', 'utility', 'page', 'h1', 'desktop', 'value', 'font-size']

    const path = token.path;

    // Find where 'value' appears in the path (it's the parent of the property)
    const valueIndex = path.indexOf('value');
    if (valueIndex === -1) return; // Skip if no 'value' in path

    // Extract the property name (last element after 'value')
    const property = path[path.length - 1];

    // Extract the base path (everything before 'value')
    const basePath = path.slice(0, valueIndex);

    // Check if there's a breakpoint (desktop, tablet, mobile) in the path
    const breakpoints = ['desktop', 'tablet', 'mobile'];
    let breakpoint = null;
    let classPath = [...basePath];

    // Check if one of the path segments is a breakpoint
    for (let i = 0; i < basePath.length; i++) {
      if (breakpoints.includes(basePath[i])) {
        breakpoint = basePath[i];
        classPath = [...basePath.slice(0, i), ...basePath.slice(i + 1)];
        break;
      }
    }

    // Generate class name from path: typography.editorial.news.h1 -> typography-editorial-news-h1
    const className = classPath.join('-').toLowerCase();
    const key = breakpoint ? `${className}-${breakpoint}` : className;

    // Initialize group if it doesn't exist
    if (!tokenGroups.has(key)) {
      tokenGroups.set(key, {
        className,
        breakpoint,
        properties: {},
      });
    }

    // Convert property name from camelCase to kebab-case
    // font-family, font-weight, font-size, line-height, letter-spacing
    const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();

    // Get the resolved value
    let cssValue = token.value;

    // If value is still a token reference string, try to resolve it
    if (typeof cssValue === 'string' && cssValue.startsWith('{') && cssValue.endsWith('}')) {
      // Try to find the referenced token in the dictionary
      const refPath = cssValue.slice(1, -1).split('.');

      // Style Dictionary stores tokens in dictionary.tokens with dot notation
      // Try to find the token by path
      let refToken = null;
      try {
        const tokenPath = refPath.join('.');
        // Access nested tokens: dictionary.tokens['font']['family']['graphik']
        refToken = refPath.reduce((obj, key) => obj && obj[key], dictionary.tokens);
      } catch (e) {
        // Token not found in nested structure
      }

      if (refToken && refToken.value) {
        cssValue = refToken.value;
      } else {
        // Fallback to CSS variable if token not found
        const varName = '--' + refPath.join('-');
        cssValue = `var(${varName})`;
      }
    }

    // Font-size tokens are numeric (px); output as CSS length
    if (cssProperty === 'font-size' && typeof cssValue === 'number') {
      cssValue = `${cssValue}px`;
    }

    tokenGroups.get(key).properties[cssProperty] = cssValue;
  });

  // Generate CSS classes
  const classes = [];

  // Breakpoint values for media queries
  const breakpointMap = {
    desktop: '@media (min-width: 1160px)',
    tablet: '@media (min-width: 768px) and (max-width: 1159px)',
    mobile: '@media (max-width: 767px)',
  };

  // Group classes by breakpoint for media query organization
  const classesByBreakpoint = new Map();
  const nonResponsiveClasses = [];

  tokenGroups.forEach((data, key) => {
    if (data.breakpoint) {
      if (!classesByBreakpoint.has(data.breakpoint)) {
        classesByBreakpoint.set(data.breakpoint, []);
      }
      classesByBreakpoint.get(data.breakpoint).push(data);
    } else {
      nonResponsiveClasses.push(data);
    }
  });

  // Tokens often define desktop + mobile only. Tablet (768–1159px) would otherwise have no
  // rules; match design intent by applying desktop typography whenever no tablet token exists.
  const desktopForTablet = classesByBreakpoint.get('desktop') || [];
  const tabletList = classesByBreakpoint.get('tablet');
  const tabletClassNames = new Set((tabletList || []).map((d) => d.className));
  desktopForTablet.forEach((data) => {
    if (!tabletClassNames.has(data.className)) {
      if (!classesByBreakpoint.has('tablet')) {
        classesByBreakpoint.set('tablet', []);
      }
      classesByBreakpoint.get('tablet').push({
        className: data.className,
        breakpoint: 'tablet',
        properties: { ...data.properties },
      });
      tabletClassNames.add(data.className);
    }
  });

  const defaultTypographyColor = 'var(--color-text-on-light-primary)';

  /** Article body drop cap tokens must apply to `::first-letter` only, not the whole paragraph. */
  const isArticleBodyDropcapClass = (className) => className === 'typography-article-body-dropcap';

  /**
   * Float the drop cap so the first line of body copy lines up at the top of the cap instead of
   * sharing a baseline with the oversized first letter (which wastes space above the paragraph).
   * Layout lives here so token values stay RN-safe (no `float` in shared composites).
   */
  const articleBodyDropcapLayoutCss = {
    float: 'left',
    'padding-right': '0.375rem',
    'line-height': '0.8',
  };

  // First, generate non-responsive classes
  nonResponsiveClasses.forEach((data) => {
    const className = `.${data.className}`;
    const mergedProps = isArticleBodyDropcapClass(data.className)
      ? { ...data.properties, ...articleBodyDropcapLayoutCss }
      : data.properties;
    const props = Object.entries(mergedProps)
      .map(([prop, value]) => {
        return `  ${prop}: ${value};`;
      })
      .join('\n');

    if (isArticleBodyDropcapClass(data.className)) {
      classes.push(`${className}::first-letter {\n${props}\n}`);
    } else {
      classes.push(`${className} {\n${props}\n}`);
    }
  });

  // Then, generate responsive classes: use the design-token class name (no -desktop/-tablet/-mobile suffix)
  // so that one class (e.g. .typography-editorial-news-h1) gets different styles per breakpoint.
  const breakpointOrder = ['mobile', 'tablet', 'desktop'];

  breakpointOrder.forEach((breakpoint) => {
    const classesForBreakpoint = classesByBreakpoint.get(breakpoint);
    if (!classesForBreakpoint || classesForBreakpoint.length === 0) {
      return;
    }

    const mediaQuery = breakpointMap[breakpoint];
    classes.push(`\n${mediaQuery} {`);

    classesForBreakpoint.forEach((data) => {
      const className = `.${data.className}`;
      const props = Object.entries(data.properties)
        .map(([prop, value]) => {
          return `    ${prop}: ${value};`;
        })
        .join('\n');

      classes.push(`  ${className} {\n${props}\n  }`);
    });

    classes.push('}');
  });

  // Add a single efficient rule that applies color to all typography classes
  // This is much more efficient than adding color to each individual class
  // Uses attribute selector to match any class containing "typography-"
  const colorRule = `\n/* Apply primary text color to all typography classes */\n[class*="typography-"] {\n  color: ${defaultTypographyColor};\n}\n`;

  return `/**\n * Do not edit directly, this file was auto-generated.\n */\n${classes.join('\n\n')}${colorRule}`;
}

module.exports = typographyClassesFormat;
